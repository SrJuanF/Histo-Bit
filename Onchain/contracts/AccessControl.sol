// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;


import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title AccessControl
 * @dev Contract for managing access permissions to medical records
 * Allows patients to grant/revoke access to insurance services and medical professionals
 */
contract AccessControl is ReentrancyGuard {
    // Custom errors
    error OnlyPatient(address entity);
    error InvalidAddress(address sender);
    error NotAccessOtherPatient_None();
    error entityTypeIncorrect();
    error accessTypeIncorrect();
    error expiresAtNotValid();
    error NotPermissionGranted();
    error NotAllowEntityAccess();

    // Enums for different types of access
    enum AccessType {
        NONE,
        READ,
        WRITE
    }
    enum EntityType {
        NONE,
        PATIENT,
        AUDITOR,
        HEALTH,
        INSURANCE,
        GOVERNMENT,
        FINANCIAL,
        EDUCATIONAL,
        LABOR,
        LEGAL,
        TECHNOLOGICAL
    }

    // Struct to store access permission details
    struct Permission {
        bool isActive;
        AccessType accessType;
        uint256 grantedAt;
        uint256 expiresAt;
        string purpose; // Purpose of access (e.g., "Insurance claim review")
    }

    // Mappings
    mapping(address => EntityType) internal entityTypes;
    mapping(uint256 => mapping(address => Permission)) internal permissions; // docId => entity => permission
    mapping(address => mapping(address => Permission)) internal patientPermissions; // patient => entity => permission

    // Events
    event AccessGrantedDoc(
        uint256 indexed docId,
        address indexed patient,
        address indexed entity,
        AccessType accessType,
        uint256 grantedAt,
        uint256 expiresAt,
        string purpose
    );
    event AccessRevokedDoc(
        uint256 indexed docId,
        address indexed patient,
        address indexed entity,
        uint256 revokedAt
    );
    event AccessGrantedEntity(
        address indexed patient,
        address indexed entity,
        AccessType accessType,
        uint256 grantedAt,
        uint256 expiresAt,
        string purpose
    );
    event AccessRevokedEntity(
        address indexed patient,
        address indexed entity,
        uint256 revokedAt
    );
    event EntityRegistered(address indexed entity, EntityType entityType);

    // Modifiers
    modifier onlyPatient() {
        if (entityTypes[msg.sender] != EntityType.PATIENT) {
            revert OnlyPatient(msg.sender);
        }
        _;
    }
    modifier onlyAllowed(address _entity){
        EntityType sender = entityTypes[msg.sender];
        EntityType userEntity = entityTypes[_entity];

        if((sender != EntityType.PATIENT && userEntity != EntityType.PATIENT) ||
        sender == EntityType.NONE || userEntity == EntityType.NONE ||
        uint8(sender) > uint8(type(EntityType).max) || uint8(userEntity) > uint8(type(EntityType).max)) {
            revert NotAllowEntityAccess();
        }
        _;
    }
    modifier validAddressAccess(address _addr) {
        if (_addr == address(0)) {
            revert InvalidAddress(msg.sender);
        }
        if (entityTypes[_addr] == EntityType.PATIENT || entityTypes[_addr] == EntityType.NONE  ||
            uint8(entityTypes[_addr]) > uint8(type(EntityType).max)) {
            revert NotAccessOtherPatient_None();
        }
        _;
    }

    /**
     * @dev Register an entity with its type
     * @param _entityType Type of entity (AUDITOR, HEALTH, INSURANCE)
     */
    function registerEntity(EntityType _entityType) external { //Payable?
        if(uint8(_entityType) > uint8(type(EntityType).max)){
            revert entityTypeIncorrect();
        }

        //Payable

        entityTypes[msg.sender] = _entityType;
        emit EntityRegistered(msg.sender, _entityType);
    }

    /**
     * @dev Grant access to an entity for the patient's records
     * @param _entity Address of the entity to grant access to
     * @param _accessType Type of access to grant
     * @param _expiresAt Timestamp when access expires (0 for no expiration)
     * @param _purpose Purpose of the access
     */
    function grantAccessEntity(
        address _entity, 
        AccessType _accessType, 
        uint256 _expiresAt, 
        string calldata _purpose
    ) external onlyPatient validAddressAccess(_entity) {

        if(uint8(_accessType) > uint8(type(AccessType).max)){
            revert accessTypeIncorrect();
        }
        if(_expiresAt <= 60){
            revert expiresAtNotValid();
        }
        //Prices

        uint256 sExpiresAt = block.timestamp + _expiresAt;
        patientPermissions[msg.sender][_entity] = Permission({
            isActive: true,
            accessType: _accessType,
            grantedAt: block.timestamp,
            expiresAt: sExpiresAt,
            purpose: _purpose
        });

        emit AccessGrantedEntity(
            msg.sender,
            _entity,
            _accessType,
            block.timestamp,
            sExpiresAt,
            _purpose
        );
    }
    /**
     * @dev Revoke access from an entity
     * @param _entity Address of the entity to revoke access from
     */
    function revokeAccessEntity(address _entity) external onlyPatient validAddressAccess(_entity) {

        Permission memory ppermission = patientPermissions[msg.sender][_entity];

        if (!ppermission.isActive) {
            revert NotPermissionGranted();
        }

        ppermission.isActive = false;
        ppermission.accessType = AccessType.NONE;
        ppermission.grantedAt = 0;
        ppermission.expiresAt = 0;
        ppermission.purpose = "";

        emit AccessRevokedEntity(msg.sender, _entity, block.timestamp);
    }

    /**
     * @dev Grant access to an entity for the patient's document record
     * @param _entity Address of the entity to grant access to
     * @param _accessType Type of access to grant
     * @param _expiresAt Timestamp when access expires (0 for no expiration)
     * @param _purpose Purpose of the access
     */
    function grantAccessDoc(
        uint256 _docId,
        address _entity, 
        AccessType _accessType, 
        uint256 _expiresAt, 
        string calldata _purpose
    ) external onlyPatient validAddressAccess(_entity) {

        if(uint8(_accessType) > uint8(type(AccessType).max)){
            revert accessTypeIncorrect();
        }
        if(_expiresAt <= 60){
            revert expiresAtNotValid();
        }

        //Prices

        uint256 sExpiresAt = block.timestamp + _expiresAt;
        permissions[_docId][_entity] = Permission({
            isActive: true,
            accessType: _accessType,
            grantedAt: block.timestamp,
            expiresAt: sExpiresAt,
            purpose: _purpose
        });

        emit AccessGrantedDoc(
            _docId,
            msg.sender,
            _entity,
            _accessType,
            block.timestamp,
            sExpiresAt,
            _purpose
        );
    }

    /**
     * @dev Revoke access from an document
     * @param _entity Address of the entity to revoke access from
     */
    function revokeAccessDoc(uint256 _docId, address _entity) external onlyPatient validAddressAccess(_entity) {

        Permission memory ppermission = permissions[_docId][_entity];

        if (!ppermission.isActive) {
            revert NotPermissionGranted();
        }

        ppermission.isActive = false;
        ppermission.accessType = AccessType.NONE;
        ppermission.grantedAt = 0;
        ppermission.expiresAt = 0;
        ppermission.purpose = "";

        emit AccessRevokedDoc(_docId, msg.sender, _entity, block.timestamp);
    }

    /**
     * @dev Get permission details for a specific patient-entity pair
     * @param _entity Address to check
     * @return Permission struct with all details
     */
    function getPermissionEntity(address _entity) external view onlyPatient returns (Permission memory) {
        return patientPermissions[msg.sender][_entity];
    }

    /**
     * @dev Get permission details for a specific document-entity pair
     * @param _entity Address to check
     * @return Permission struct with all details
     */
    function getPermissionDoc(uint256 _docId, address _entity) external view onlyPatient returns (Permission memory) {
        return permissions[_docId][_entity];
    }

    /**
     * @dev Get entity type for an address
     * @param _entity Address to check
     * @return EntityType of the address
     */
    function getEntityType(address _entity) external view returns (EntityType) {
        return entityTypes[_entity];
    }
}