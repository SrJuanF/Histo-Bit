import { BigInt, Address } from "@graphprotocol/graph-ts";
import {
  AccessGrantedDoc as AccessGrantedDocEvent,
  AccessGrantedEntity as AccessGrantedEntityEvent,
  AccessRevokedDoc as AccessRevokedDocEvent,
  AccessRevokedEntity as AccessRevokedEntityEvent,
  DocumentAdded as DocumentAddedEvent,
  DocumentDeactivated as DocumentDeactivatedEvent,
  DocumentUpdated as DocumentUpdatedEvent,
  EntityRegistered as EntityRegisteredEvent,
} from "../generated/DocsRecords/DocsRecords";
import {
  ActiveDocs,
  ActiveEntities,
  ActiveAccessDoc,
  ActiveAccessEntity,
} from "../generated/schema";

//Doc
export function handleDocumentAdded(event: DocumentAddedEvent): void {
  let entity = new ActiveDocs(event.params.documentId.toString());

  entity.documentId = event.params.documentId;
  entity.owner = event.params.owner;
  entity.createdBy = event.params.createdBy;
  entity.updatedBy = Address.fromString(
    "0x0000000000000000000000000000000000000000"
  );
  entity.ipfsCID = event.params.ipfsCID;
  entity.documentType = event.params.documentType;
  entity.description = event.params.description;
  entity.createdAt = event.params.createdAt;
  entity.updatedAt = event.params.createdAt;
  entity.isActive = event.params.isActive;
  entity.sectorType = event.params.sectorType;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleDocumentUpdated(event: DocumentUpdatedEvent): void {
  let itemListed = ActiveDocs.load(event.params.documentId.toString());

  if (!itemListed) {
    itemListed = new ActiveDocs(event.params.documentId.toString());
  }

  itemListed.updatedBy = event.params.updatedBy;
  itemListed.ipfsCID = event.params.ipfsCID;
  itemListed.documentType = event.params.documentType;
  itemListed.description = event.params.description;
  itemListed.updatedAt = event.params.updatedAt;
  itemListed.isActive = event.params.isActive;

  //itemListed.blockNumber = event.block.number
  //itemListed.blockTimestamp = event.block.timestamp
  itemListed.transactionHash = event.transaction.hash;

  itemListed.save();
}

export function handleDocumentDeactivated(
  event: DocumentDeactivatedEvent
): void {
  let itemListed = ActiveDocs.load(event.params.documentId.toString());

  if (!itemListed) {
    itemListed = new ActiveDocs(event.params.documentId.toString());
  }
  itemListed.isActive = false;

  //itemListed.blockNumber = event.block.number
  itemListed.blockTimestamp = event.block.timestamp;
  //itemListed.transactionHash = event.transaction.hash

  itemListed.save();
}

//Entity
export function handleEntityRegistered(event: EntityRegisteredEvent): void {
  let entity = ActiveEntities.load(event.params.entity.toHexString());

  if (!entity) {
    entity = new ActiveEntities(event.params.entity.toHexString());
    entity.blockNumber = event.block.number;
    entity.blockTimestamp = event.block.timestamp;
  }

  entity.entity = event.params.entity;
  entity.entityType = event.params.entityType;

  entity.transactionHash = event.transaction.hash;

  entity.save();
}

//Access
export function handleAccessGrantedDoc(event: AccessGrantedDocEvent): void {
  let uniqueId = event.params.docId.toString() + "-" + event.params.entity.toHexString();
  let listItem = ActiveAccessDoc.load(uniqueId);

  if (!listItem) {
    listItem = new ActiveAccessDoc(uniqueId);

    listItem.docId = event.params.docId;
    listItem.patient = event.params.patient;
    listItem.entity = event.params.entity;

    listItem.blockNumber = event.block.number;
    listItem.blockTimestamp = event.block.timestamp;
  }

  listItem.isActive = true;
  listItem.accessType = event.params.accessType;
  listItem.grantedAt = event.params.grantedAt;
  listItem.expiresAt = event.params.expiresAt;
  listItem.purpose = event.params.purpose;

  listItem.transactionHash = event.transaction.hash;

  listItem.save();
}

export function handleAccessRevokedDoc(event: AccessRevokedDocEvent): void {
  let uniqueId = event.params.docId.toString() + "-" + event.params.entity.toHexString();
  let listItem = ActiveAccessDoc.load(uniqueId);

  if (!listItem) {
    listItem = new ActiveAccessDoc(uniqueId);

    listItem.docId = event.params.docId;
    listItem.patient = event.params.patient;
    listItem.entity = event.params.entity;

    listItem.blockTimestamp = event.block.timestamp;
    listItem.blockNumber = event.block.number;
  }

  listItem.isActive = false;
  listItem.accessType = 0;
  
  listItem.transactionHash = event.transaction.hash;

  listItem.save();
}

export function handleAccessGrantedEntity(
  event: AccessGrantedEntityEvent
): void {
  let uniqueId = event.params.patient.toHexString() + "-" + event.params.entity.toHexString();
  let entity = ActiveAccessEntity.load(uniqueId);

  if (!entity) {
    entity = new ActiveAccessEntity(uniqueId);

    entity.patient = event.params.patient;
    entity.entity = event.params.entity;

    entity.blockNumber = event.block.number;
    entity.blockTimestamp = event.block.timestamp;
  }

  entity.isActive = true;
  entity.accessType = event.params.accessType;
  entity.grantedAt = event.params.grantedAt;
  entity.expiresAt = event.params.expiresAt;
  entity.purpose = event.params.purpose;

  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleAccessRevokedEntity(
  event: AccessRevokedEntityEvent
): void {
  let uniqueId = event.params.patient.toHexString() + "-" + event.params.entity.toHexString();
  let entity = ActiveAccessEntity.load(uniqueId);

  if (!entity) {
    entity = new ActiveAccessEntity(uniqueId);

    entity.patient = event.params.patient;
    entity.entity = event.params.entity;

    entity.blockNumber = event.block.number;
    entity.blockTimestamp = event.block.timestamp;
  }

  entity.isActive = false;
  entity.accessType = 0;

  entity.transactionHash = event.transaction.hash;

  entity.save();
}
