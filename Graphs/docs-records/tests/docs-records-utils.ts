import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt, Address } from "@graphprotocol/graph-ts"
import {
  AccessGrantedDoc,
  AccessGrantedEntity,
  AccessRevokedDoc,
  AccessRevokedEntity,
  DocumentAdded,
  DocumentDeactivated,
  DocumentUpdated,
  EntityRegistered,
  OwnershipTransferred
} from "../generated/DocsRecords/DocsRecords"

export function createAccessGrantedDocEvent(
  docId: BigInt,
  patient: Address,
  entity: Address,
  accessType: i32,
  grantedAt: BigInt,
  expiresAt: BigInt,
  purpose: string
): AccessGrantedDoc {
  let accessGrantedDocEvent = changetype<AccessGrantedDoc>(newMockEvent())

  accessGrantedDocEvent.parameters = new Array()

  accessGrantedDocEvent.parameters.push(
    new ethereum.EventParam("docId", ethereum.Value.fromUnsignedBigInt(docId))
  )
  accessGrantedDocEvent.parameters.push(
    new ethereum.EventParam("patient", ethereum.Value.fromAddress(patient))
  )
  accessGrantedDocEvent.parameters.push(
    new ethereum.EventParam("entity", ethereum.Value.fromAddress(entity))
  )
  accessGrantedDocEvent.parameters.push(
    new ethereum.EventParam(
      "accessType",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(accessType))
    )
  )
  accessGrantedDocEvent.parameters.push(
    new ethereum.EventParam(
      "grantedAt",
      ethereum.Value.fromUnsignedBigInt(grantedAt)
    )
  )
  accessGrantedDocEvent.parameters.push(
    new ethereum.EventParam(
      "expiresAt",
      ethereum.Value.fromUnsignedBigInt(expiresAt)
    )
  )
  accessGrantedDocEvent.parameters.push(
    new ethereum.EventParam("purpose", ethereum.Value.fromString(purpose))
  )

  return accessGrantedDocEvent
}

export function createAccessGrantedEntityEvent(
  patient: Address,
  entity: Address,
  accessType: i32,
  grantedAt: BigInt,
  expiresAt: BigInt,
  purpose: string
): AccessGrantedEntity {
  let accessGrantedEntityEvent = changetype<AccessGrantedEntity>(newMockEvent())

  accessGrantedEntityEvent.parameters = new Array()

  accessGrantedEntityEvent.parameters.push(
    new ethereum.EventParam("patient", ethereum.Value.fromAddress(patient))
  )
  accessGrantedEntityEvent.parameters.push(
    new ethereum.EventParam("entity", ethereum.Value.fromAddress(entity))
  )
  accessGrantedEntityEvent.parameters.push(
    new ethereum.EventParam(
      "accessType",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(accessType))
    )
  )
  accessGrantedEntityEvent.parameters.push(
    new ethereum.EventParam(
      "grantedAt",
      ethereum.Value.fromUnsignedBigInt(grantedAt)
    )
  )
  accessGrantedEntityEvent.parameters.push(
    new ethereum.EventParam(
      "expiresAt",
      ethereum.Value.fromUnsignedBigInt(expiresAt)
    )
  )
  accessGrantedEntityEvent.parameters.push(
    new ethereum.EventParam("purpose", ethereum.Value.fromString(purpose))
  )

  return accessGrantedEntityEvent
}

export function createAccessRevokedDocEvent(
  docId: BigInt,
  patient: Address,
  entity: Address,
  revokedAt: BigInt
): AccessRevokedDoc {
  let accessRevokedDocEvent = changetype<AccessRevokedDoc>(newMockEvent())

  accessRevokedDocEvent.parameters = new Array()

  accessRevokedDocEvent.parameters.push(
    new ethereum.EventParam("docId", ethereum.Value.fromUnsignedBigInt(docId))
  )
  accessRevokedDocEvent.parameters.push(
    new ethereum.EventParam("patient", ethereum.Value.fromAddress(patient))
  )
  accessRevokedDocEvent.parameters.push(
    new ethereum.EventParam("entity", ethereum.Value.fromAddress(entity))
  )
  accessRevokedDocEvent.parameters.push(
    new ethereum.EventParam(
      "revokedAt",
      ethereum.Value.fromUnsignedBigInt(revokedAt)
    )
  )

  return accessRevokedDocEvent
}

export function createAccessRevokedEntityEvent(
  patient: Address,
  entity: Address,
  revokedAt: BigInt
): AccessRevokedEntity {
  let accessRevokedEntityEvent = changetype<AccessRevokedEntity>(newMockEvent())

  accessRevokedEntityEvent.parameters = new Array()

  accessRevokedEntityEvent.parameters.push(
    new ethereum.EventParam("patient", ethereum.Value.fromAddress(patient))
  )
  accessRevokedEntityEvent.parameters.push(
    new ethereum.EventParam("entity", ethereum.Value.fromAddress(entity))
  )
  accessRevokedEntityEvent.parameters.push(
    new ethereum.EventParam(
      "revokedAt",
      ethereum.Value.fromUnsignedBigInt(revokedAt)
    )
  )

  return accessRevokedEntityEvent
}

export function createDocumentAddedEvent(
  documentId: BigInt,
  owner: Address,
  createdBy: Address,
  ipfsCID: string,
  documentType: string,
  description: string,
  createdAt: BigInt,
  isActive: boolean,
  sectorType: i32
): DocumentAdded {
  let documentAddedEvent = changetype<DocumentAdded>(newMockEvent())

  documentAddedEvent.parameters = new Array()

  documentAddedEvent.parameters.push(
    new ethereum.EventParam(
      "documentId",
      ethereum.Value.fromUnsignedBigInt(documentId)
    )
  )
  documentAddedEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  documentAddedEvent.parameters.push(
    new ethereum.EventParam("createdBy", ethereum.Value.fromAddress(createdBy))
  )
  documentAddedEvent.parameters.push(
    new ethereum.EventParam("ipfsCID", ethereum.Value.fromString(ipfsCID))
  )
  documentAddedEvent.parameters.push(
    new ethereum.EventParam(
      "documentType",
      ethereum.Value.fromString(documentType)
    )
  )
  documentAddedEvent.parameters.push(
    new ethereum.EventParam(
      "description",
      ethereum.Value.fromString(description)
    )
  )
  documentAddedEvent.parameters.push(
    new ethereum.EventParam(
      "createdAt",
      ethereum.Value.fromUnsignedBigInt(createdAt)
    )
  )
  documentAddedEvent.parameters.push(
    new ethereum.EventParam("isActive", ethereum.Value.fromBoolean(isActive))
  )
  documentAddedEvent.parameters.push(
    new ethereum.EventParam(
      "sectorType",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(sectorType))
    )
  )

  return documentAddedEvent
}

export function createDocumentDeactivatedEvent(
  documentId: BigInt,
  deactivatedBy: Address,
  deactivatedAt: BigInt
): DocumentDeactivated {
  let documentDeactivatedEvent = changetype<DocumentDeactivated>(newMockEvent())

  documentDeactivatedEvent.parameters = new Array()

  documentDeactivatedEvent.parameters.push(
    new ethereum.EventParam(
      "documentId",
      ethereum.Value.fromUnsignedBigInt(documentId)
    )
  )
  documentDeactivatedEvent.parameters.push(
    new ethereum.EventParam(
      "deactivatedBy",
      ethereum.Value.fromAddress(deactivatedBy)
    )
  )
  documentDeactivatedEvent.parameters.push(
    new ethereum.EventParam(
      "deactivatedAt",
      ethereum.Value.fromUnsignedBigInt(deactivatedAt)
    )
  )

  return documentDeactivatedEvent
}

export function createDocumentUpdatedEvent(
  documentId: BigInt,
  updatedBy: Address,
  ipfsCID: string,
  documentType: string,
  description: string,
  updatedAt: BigInt,
  isActive: boolean
): DocumentUpdated {
  let documentUpdatedEvent = changetype<DocumentUpdated>(newMockEvent())

  documentUpdatedEvent.parameters = new Array()

  documentUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "documentId",
      ethereum.Value.fromUnsignedBigInt(documentId)
    )
  )
  documentUpdatedEvent.parameters.push(
    new ethereum.EventParam("updatedBy", ethereum.Value.fromAddress(updatedBy))
  )
  documentUpdatedEvent.parameters.push(
    new ethereum.EventParam("ipfsCID", ethereum.Value.fromString(ipfsCID))
  )
  documentUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "documentType",
      ethereum.Value.fromString(documentType)
    )
  )
  documentUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "description",
      ethereum.Value.fromString(description)
    )
  )
  documentUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "updatedAt",
      ethereum.Value.fromUnsignedBigInt(updatedAt)
    )
  )
  documentUpdatedEvent.parameters.push(
    new ethereum.EventParam("isActive", ethereum.Value.fromBoolean(isActive))
  )

  return documentUpdatedEvent
}

export function createEntityRegisteredEvent(
  entity: Address,
  entityType: i32
): EntityRegistered {
  let entityRegisteredEvent = changetype<EntityRegistered>(newMockEvent())

  entityRegisteredEvent.parameters = new Array()

  entityRegisteredEvent.parameters.push(
    new ethereum.EventParam("entity", ethereum.Value.fromAddress(entity))
  )
  entityRegisteredEvent.parameters.push(
    new ethereum.EventParam(
      "entityType",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(entityType))
    )
  )

  return entityRegisteredEvent
}

export function createOwnershipTransferredEvent(
  previousOwner: Address,
  newOwner: Address
): OwnershipTransferred {
  let ownershipTransferredEvent =
    changetype<OwnershipTransferred>(newMockEvent())

  ownershipTransferredEvent.parameters = new Array()

  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam(
      "previousOwner",
      ethereum.Value.fromAddress(previousOwner)
    )
  )
  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )

  return ownershipTransferredEvent
}
