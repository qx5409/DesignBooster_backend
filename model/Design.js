"use strict";
var escape = require("escape-html");

const FILE_PATH = __dirname + "/../data/designs.json";

class Design {
  constructor(data) {
    this.id = Design.nextDesignId();
    //escape the name & links in order to protect agains XSS attacks
    this.name = escape(data.title);
    this.images = data.images;
    this.description = data.description;
    this.feature = data.feature;
    this.imageIncluded = data.imageIncluded;
    this.videoIncluded = data.videoIncluded;
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.contact = data.contact;
    // add protocole if needed to the links
    if (data.facebook && !data.facebook.match(/^(http|https)/))
      data.facebook = "http://" + data.facebook;
    this.facebook = escape(data.facebook);
    this.email = data.email;
    if (data.instagram && !data.instagram.match(/^(http|https)/))
      data.instagram = "http://" + data.instagram;
    this.instagram = escape(data.instagram);
    if (data.linkedin && !data.linkedin.match(/^(http|https)/))
      data.linkedin = "http://" + data.linkedin;
    this.linkedin = escape(data.linkedin);
  }

  static nextDesignId() {
    let designsList = getDesignsListFromFile(FILE_PATH);
    if (designsList.length === 0) return 1;
    return designsList[designsList.length - 1].id + 1;
  }

  save() {
    let designsList = getDesignsListFromFile(FILE_PATH);
    designsList.push(this);
    saveDesignsListToFile(FILE_PATH, designsList);
  }

  static update(id, newData) {
    let designsList = getDesignsListFromFile(FILE_PATH);
    let index = designsList.findIndex((design) => design.id == id);
    if (index < 0 || !newData) return;
    //escape the name & links in order to protect agains XSS attacks
    if (newData.name) newData.name = escape(newData.name);
    if (newData.images) newData.images = newData.images;
    if (newData.description) newData.description = newData.description;
    if (newData.feature) newData.feature = newData.feature;
    if (newData.imageIncluded) newData.imageIncluded = newData.imageIncluded;
    if (newData.videoIncluded) newData.videoIncluded = newData.videoIncluded;
    if (newData.firstName) newData.firstName = newData.firstName;
    if (newData.lastName) newData.lastName = newData.lastName;
    if (newData.contact) newData.contact = newData.contact;
    if (newData.facebook) newData.facebook = escape(newData.facebook);
    if (newData.email) newData.email = newData.email;
    if (newData.instagram) newData.instagram = escape(newData.instagram);
    if (newData.linkedin) newData.linkedin = escape(newData.linkedin);
    //Use the spread operator to shallow copy all existing attributes of a design
    //Then replace some of the existing attributes by the keys/values of newData
    designsList[index] = { ...designsList[index], ...newData };
    const designUpdated = { ...designsList[index] };
    saveDesignsListToFile(FILE_PATH, designsList);
    return designUpdated;
  }

  static get(id) {
    let designsList = getDesignsListFromFile(FILE_PATH);
    return designsList.find((design) => design.id == id);
  }

  static get list() {
    return getDesignsListFromFile(FILE_PATH);
  }

  static delete(id) {
    let designsList = getDesignsListFromFile(FILE_PATH);
    const index = designsList.findIndex((design) => design.id == id);
    if (index < 0) return;
    const itemRemoved = { ...designsList[index] };
    // remove the design found at index
    designsList.splice(index, 1);
    saveDesignsListToFile(FILE_PATH, designsList);
    return itemRemoved;
  }
}

function getDesignsListFromFile(filePath) {
  const fs = require("fs");
  if (!fs.existsSync(filePath)) return [];
  let designsListRawData = fs.readFileSync(filePath);
  let designsList;
  if (designsListRawData) designsList = JSON.parse(designsListRawData);
  else designsList = [];
  return designsList;
}

function saveDesignsListToFile(filePath, designsList) {
  const fs = require("fs");
  let data = JSON.stringify(designsList);
  fs.writeFileSync(filePath, data);
}

module.exports = Design;
