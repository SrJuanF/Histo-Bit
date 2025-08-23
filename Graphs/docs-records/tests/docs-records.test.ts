import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { BigInt, Address } from "@graphprotocol/graph-ts"
import { AccessGrantedDoc } from "../generated/schema"
import { AccessGrantedDoc as AccessGrantedDocEvent } from "../generated/DocsRecords/DocsRecords"
import { handleAccessGrantedDoc } from "../src/docs-records"
import { createAccessGrantedDocEvent } from "./docs-records-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/subgraphs/developing/creating/unit-testing-framework/#tests-structure

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let docId = BigInt.fromI32(234)
    let patient = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let entity = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let accessType = 123
    let grantedAt = BigInt.fromI32(234)
    let expiresAt = BigInt.fromI32(234)
    let purpose = "Example string value"
    let newAccessGrantedDocEvent = createAccessGrantedDocEvent(
      docId,
      patient,
      entity,
      accessType,
      grantedAt,
      expiresAt,
      purpose
    )
    handleAccessGrantedDoc(newAccessGrantedDocEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/subgraphs/developing/creating/unit-testing-framework/#write-a-unit-test

  test("AccessGrantedDoc created and stored", () => {
    assert.entityCount("AccessGrantedDoc", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "AccessGrantedDoc",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "docId",
      "234"
    )
    assert.fieldEquals(
      "AccessGrantedDoc",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "patient",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "AccessGrantedDoc",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "entity",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "AccessGrantedDoc",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "accessType",
      "123"
    )
    assert.fieldEquals(
      "AccessGrantedDoc",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "grantedAt",
      "234"
    )
    assert.fieldEquals(
      "AccessGrantedDoc",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "expiresAt",
      "234"
    )
    assert.fieldEquals(
      "AccessGrantedDoc",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "purpose",
      "Example string value"
    )

    // More assert options:
    // https://thegraph.com/docs/en/subgraphs/developing/creating/unit-testing-framework/#asserts
  })
})
