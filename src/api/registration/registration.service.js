const { info } = require("winston");
const moment = require("moment");
const fetch = require("node-fetch");

const {
  createRegistration,
  createEstablishment,
  createOperator,
  createActivities,
  createPremise,
  createMetadata,
  getRegistrationById,
  getEstablishmentByRegId,
  getMetadataByRegId,
  getOperatorByEstablishmentId,
  getPremiseByEstablishmentId,
  getActivitiesByEstablishmentId
} = require("../../connectors/registrationDb/registrationDb");

const {
  createFoodBusinessRegistration,
  createReferenceNumber
} = require("../../connectors/tascomi/tascomi.connector");

const saveRegistration = async registration => {
  info("registration.connector: saveRegistration: called");
  const reg = await createRegistration({});
  const establishment = await createEstablishment(
    registration.establishment.establishment_details,
    reg.id
  );

  const operator = await createOperator(
    registration.establishment.operator,
    establishment.id
  );

  const activities = await createActivities(
    registration.establishment.activities,
    establishment.id
  );

  const premise = await createPremise(
    registration.establishment.premise,
    establishment.id
  );

  const metadata = await createMetadata(registration.metadata, reg.id);
  info("registration.connector: saveRegistration: successful");
  return {
    regId: reg.id,
    establishmentId: establishment.id,
    operatorId: operator.id,
    activitiesId: activities.id,
    premiseId: premise.id,
    metadataId: metadata.id
  };
};

const getFullRegistrationById = async id => {
  info("registration.connector: getFullRegistrationById: called");
  const registration = await getRegistrationById(id);
  const establishment = await getEstablishmentByRegId(registration.id);
  const metadata = await getMetadataByRegId(registration.id);
  const operator = await getOperatorByEstablishmentId(establishment.id);
  const activities = await getActivitiesByEstablishmentId(establishment.id);
  const premise = await getPremiseByEstablishmentId(establishment.id);
  info("registration.connector: getFullRegistrationById: successful");
  return {
    registration,
    establishment,
    operator,
    activities,
    premise,
    metadata
  };
};

const sendTascomiRegistration = async (registration, fsa_rn) => {
  info("registration.connector: sendTascomiRegistration: called");
  const reg = await createFoodBusinessRegistration(registration, fsa_rn);
  const response = await createReferenceNumber(JSON.parse(reg).id);
  info("registration.connector: sendTascomiRegistration: successful");
  return response;
};

const getRegistrationMetaData = async () => {
  const reg_submission_date = moment().format("YYYY MM DD");
  const fsaRnResponse = await fetch(
    "https://fsa-rn.epimorphics.net/fsa-rn/1000/01"
  );
  let fsa_rn;
  if (fsaRnResponse.status === 200) {
    fsa_rn = await fsaRnResponse.json();
  }

  return {
    "fsa-rn": fsa_rn ? fsa_rn["fsa-rn"] : undefined,
    reg_submission_date: reg_submission_date
  };
};

module.exports = {
  saveRegistration,
  getFullRegistrationById,
  sendTascomiRegistration,
  getRegistrationMetaData
};
