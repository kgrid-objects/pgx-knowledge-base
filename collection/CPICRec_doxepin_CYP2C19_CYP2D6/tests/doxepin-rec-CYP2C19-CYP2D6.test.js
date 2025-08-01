import {dosingrecommendation}  from '../recommendation.js';
import expect from 'expect';

describe('Give correct doxepin recommendations', () => {
  let inputList = {};
  beforeEach(()=>{
    inputList = {};
  });

  it('Should return a normal/normal recommendation', () => {
    inputList.CYP2C19 = {
      "diplotype":"*1/*1", "phenotype":"Normal metabolizer"
    };
    inputList.CYP2D6 = {
      "diplotype":"*1/*1", "phenotype":"Normal metabolizer"
    };
    let result = dosingrecommendation(inputList);
    expect(result.recommendation.implication).toEqual("");
    expect(result.recommendation.content).toEqual(
        "Initiate therapy with recommended starting dose");
  });

  it('Should return a normal/null recommendation', () => {
    inputList.CYP2C19 = {
      "diplotype":"*1/*1", "phenotype":"Normal metabolizer"
    };
    inputList.CYP2D6 = {};
    let result = dosingrecommendation(inputList);
    expect(result.recommendation.implication).toEqual(
        "Normal metabolism of tertiary amines");
    expect(result.recommendation.content).toEqual(
        "Initiate therapy with recommended starting dose.");
  });

  it('Should return a null/ultrarapid recommendation', () => {
    inputList.CYP2D6 = {
      "diplotype":"*1/*1", "phenotype":"Ultrarapid metabolizer"
    };
    inputList.CYP2C19 = {};
    let result = dosingrecommendation(inputList);
    expect(result.recommendation.implication).toEqual(expect.stringContaining(
        "Increased metabolism of TCAs to less active compounds"));
  });

  it('Should return a poor/poor recommendation', () => {
    inputList.CYP2C19 = {
      "diplotype":"*1/*1", "phenotype":"Poor metabolizer"
    };
    inputList.CYP2D6 = {
      "diplotype":"*1/*1", "phenotype":"Poor metabolizer"
    };
    let result = dosingrecommendation(inputList);
    expect(result.recommendation.content).toEqual(
        "Avoid doxepin use");
  });

  it('Should fail if no phenotype', () => {
    inputList.CYP2C19 = { "diplotype":"*1/*1" };
    inputList.CYP2D6 = { "diplotype":"*1/*1" };
    let result = dosingrecommendation(inputList);
    expect(result).toEqual("Incorrect/invalid input for drug doxepin");
  });

  it('Should fail if unrecognized phenotype', () => {
    inputList.CYP2C19 = { "diplotype":"*1/*1", "phenotype":"Amazing metabolizer" };
    inputList.CYP2D6 = { "diplotype":"*1/*1", "phenotype":"Amazing metabolizer" };
    let result = dosingrecommendation(inputList);
    expect(result).toEqual("Incorrect/invalid input for drug doxepin");
  });

  it('Should fail if no CYP2D6 gene in list', () => {
    inputList.CYP2C19 = { "diplotype":"*1/*1", "phenotype":"Amazing metabolizer" };
    let result = dosingrecommendation(inputList);
    expect(result).toEqual("Incorrect/invalid input for drug doxepin");
  });

  it('Should ignore other gene fields', () => {
    inputList.CYP2C19 = { "diplotype":"*1/*1", "phenotype":"Normal metabolizer" };
    inputList.CYP2C20 = { "diplotype":"*1/*1", "phenotype":"Rapid metabolizer" };
    inputList.CYP2D6 = { "diplotype":"*1/*1", "phenotype":"Normal metabolizer" };
    let result = dosingrecommendation(inputList);
    expect(result.recommendation.content).toEqual(
        "Initiate therapy with recommended starting dose");
  });

});
