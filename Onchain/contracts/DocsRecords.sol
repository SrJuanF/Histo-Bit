// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./AccessControl.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title DocsRecords
 * @dev Contract for managing private documents metadata and ownership
 * Integrates with AccessControl for permission management
 */
contract DocsRecords is AccessControl, Ownable {
    //errors
    error InvalidDocumentInputs();
    error UnauthorizedUser();

    //structs
    struct Document {
        uint256 id;
        address payable owner;
        address createdBy;
        address updatedBy; 
        bytes32 documentHash; 
        string ipfsCID; 
        string documentType; 
        string description; 
        uint256 createdAt;
        uint256 updatedAt; 
        bool isActive; 
        EntityType sectorType;
    }

    // State variables
    uint256 private s_nextDocId;

    // Mappings
    mapping(uint256 => Document) private s_documents;
    mapping(address => uint256[]) public s_patientDocuments; // patient => document IDs

    // Events
    event DocumentAdded(
        uint256 indexed documentId,
        address indexed owner,
        address indexed createdBy,
        string ipfsCID,
        string documentType,
        string description,
        uint256 createdAt,
        bool isActive,
        EntityType sectorType
    );
    event DocumentUpdated(
        uint256 indexed documentId,
        address indexed updatedBy,
        string ipfsCID,
        string documentType,
        string description,
        uint256 updatedAt,
        bool isActive
    );
    event DocumentDeactivated(
        uint256 indexed documentId,
        address indexed deactivatedBy,
        uint256 deactivatedAt
    );

    modifier verifyInputs(
        bytes32 _documentHash,
        string calldata _ipfsHash,
        string calldata _documentType,
        string calldata _description
    ) {
        if (
            _documentHash == bytes32(0) ||
            bytes(_ipfsHash).length == 0 ||
            bytes(_documentType).length == 0 ||
            bytes(_description).length == 0
        ) {
            revert InvalidDocumentInputs();
        }
        _;
    }

    constructor() Ownable(msg.sender) {
        // Initialize the contract
        s_nextDocId = 1;
    }

    /**
     * @notice Access Function to filter valid entities and inputs for creating a document
     */
    function accessCreateDocument(
        address _entity,
        bytes32 _documentHash,
        string calldata _ipfsHash,
        string calldata _documentType,
        string calldata _description,
        bool _isActive,
        EntityType _sectorType
    )
        external
        onlyAllowed(_entity)
        verifyInputs(_documentHash, _ipfsHash, _documentType, _description)
        returns (uint256)
    {
        if (uint8(_sectorType) > uint8(type(EntityType).max)) {
            revert InvalidDocumentInputs();
        }

        address holder = entityTypes[msg.sender] == EntityType.PATIENT ? msg.sender : _entity;
        address creator = entityTypes[msg.sender] != EntityType.PATIENT ? msg.sender : _entity;

        Permission memory allowance = patientPermissions[holder][creator];

        if (
            allowance.isActive == false ||
            allowance.accessType != AccessType.WRITE ||
            allowance.expiresAt < block.timestamp
        ) {
            revert NotPermissionGranted();
        }

        return
            addDocumentHolder(
                holder,
                creator,
                _documentHash,
                _ipfsHash,
                _documentType,
                _description,
                _isActive,
                _sectorType
            );
    }

    /**
     * @dev Add a new document by the User
     * @param _holder Address of the document owner
     * @param _creator Address of the entity creating the document
     * @param _documentHash Hash of the document
     * @param _ipfsHash IPFS hash of the encrypted document
     * @param _documentType Type of the document
     * @param _description Description of the document
     * @param _isActive Whether the document is active
     * @param _sectorType Sector type of the document
     * @return documentId The ID of the created document
     */
    function addDocumentHolder(
        address _holder,
        address _creator,
        bytes32 _documentHash,
        string calldata _ipfsHash,
        string calldata _documentType,
        string calldata _description,
        bool _isActive,
        EntityType _sectorType
    ) private returns (uint256) {
        uint256 docId = s_nextDocId++;
        uint256 createdAt = block.timestamp;

        // Create and populate document
        s_documents[docId] = Document({
            id: docId,
            owner: payable(_holder),
            createdBy: _creator,
            updatedBy: address(0),
            documentHash: _documentHash,
            ipfsCID: _ipfsHash,
            documentType: _documentType,
            description: _description,
            createdAt: createdAt,
            updatedAt: 0,
            isActive: _isActive,
            sectorType: _sectorType
        });
        s_patientDocuments[msg.sender].push(docId);

        emit DocumentAdded(
            docId,
            _holder,
            _creator,
            _ipfsHash,
            _documentType,
            _description,
            createdAt,
            _isActive,
            _sectorType
        );

        return docId;
    }

    /**
     * @notice Access Function to filter valid entities and inputs for updating a document
     */
    function accessUpdateDocument(
        uint256 _docId,
        bytes32 _documentHash,
        string calldata _ipfsHash,
        string calldata _documentType,
        string calldata _description,
        bool _isActive
    ) external verifyInputs(_documentHash, _ipfsHash, _documentType, _description) {
        EntityType sender = entityTypes[msg.sender];

        if (sender == EntityType.NONE || uint8(sender) > uint8(type(EntityType).max)) {
            revert NotAllowEntityAccess();
        }

        Document memory doc = s_documents[_docId];

        if (sender == EntityType.PATIENT) {
            if (address(doc.owner) != msg.sender) {
                revert UnauthorizedUser();
            }
        } else {
            Permission memory allowance = permissions[_docId][msg.sender];

            if (
                allowance.isActive == false ||
                allowance.accessType != AccessType.WRITE ||
                allowance.expiresAt < block.timestamp
            ) {
                revert NotPermissionGranted();
            }
        }

        updateDocumentHolder(
            _docId,
            _documentHash,
            _ipfsHash,
            _documentType,
            _description,
            _isActive
        );
    }

    /**
     * @dev Update an existing document by the User
     * @param _docId ID of the document to update
     * @param _documentHash New hash of the document
     * @param _ipfsHash New IPFS hash of the encrypted document
     * @param _documentType New type of the document
     * @param _description New description of the document
     * @param _isActive Whether the document is active
     */
    function updateDocumentHolder(
        uint256 _docId,
        bytes32 _documentHash,
        string calldata _ipfsHash,
        string calldata _documentType,
        string calldata _description,
        bool _isActive
    ) private {
        Document storage doc = s_documents[_docId];

        uint256 updatedAt = block.timestamp;

        doc.updatedBy = msg.sender;
        doc.documentHash = _documentHash;
        doc.ipfsCID = _ipfsHash;
        doc.documentType = _documentType;
        doc.description = _description;
        doc.updatedAt = updatedAt;
        doc.isActive = _isActive;

        emit DocumentUpdated(
            _docId,
            msg.sender,
            _ipfsHash,
            _documentType,
            _description,
            updatedAt,
            _isActive
        );
    }

    //Function to deactivate a document
    function deactivateDocument(address _entity, uint256 _docId) external onlyAllowed(_entity){

        address holder = entityTypes[msg.sender] == EntityType.PATIENT ? msg.sender : _entity;
        address creator = entityTypes[msg.sender] != EntityType.PATIENT ? msg.sender : _entity;

        Permission memory allowance = patientPermissions[holder][creator];

        if (
            allowance.isActive == false ||
            allowance.accessType != AccessType.WRITE ||
            allowance.expiresAt < block.timestamp
        ) {
            revert NotPermissionGranted();
        }

        Document storage doc = s_documents[_docId];

        if(address(doc.owner) != holder) {
            revert UnauthorizedUser();
        }

        doc.isActive = false;
        emit DocumentDeactivated(_docId, creator, block.timestamp);
    }

    function getDocument(uint256 _docId) external view returns (Document memory) {
        EntityType sender = entityTypes[msg.sender];

        if (sender == EntityType.NONE || uint8(sender) > uint8(type(EntityType).max)) {
            revert NotAllowEntityAccess();
        }

        Document memory doc = s_documents[_docId];

        if (sender == EntityType.PATIENT) {
            if (address(doc.owner) != msg.sender) {
                revert UnauthorizedUser();
            }
        } else {
            Permission memory allowance = permissions[_docId][msg.sender];

            if (
                allowance.isActive == false ||
                allowance.accessType != AccessType.READ ||
                allowance.expiresAt < block.timestamp
            ) {
                revert NotPermissionGranted();
            }
        }
        return s_documents[_docId];
    }
}
