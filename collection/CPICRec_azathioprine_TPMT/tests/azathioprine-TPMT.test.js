import {dosingrecommendation}  from '../recommendation.js';
import expect from 'expect';

describe('Give correct azathioprine recommendations', () => {
  let inputList = {};
  beforeEach(()=>{
    inputList = {};
  });

  it('Should return a normal recommendation', () => {
    inputList.TPMT = {
      "diplotype":"*1/*1", "phenotype":"Normal metabolizer"
    };
    let result = dosingrecommendation(inputList);
    expect(result.recommendation.content).toEqual(expect.stringContaining(
        "Start with normal starting dose (e.g., 2-3mg/kg/d) and adjust"));
  });

  it('Should return an intermediate recommendation', () => {
    inputList.TPMT = {
      "diplotype":"*1/*1", "phenotype":"Intermediate metabolizer"
    };
    let result = dosingrecommendation(inputList);
    expect(result.recommendation.content).toEqual(expect.stringContaining(
        "If disease treatment normally starts at the “full dose”,"));
  });

  it('Should return a low recommendation', () => {
    inputList.TPMT = {
      "diplotype":"*1/*1", "phenotype":"Low metabolizer"
    };
    let result = dosingrecommendation(inputList);
    expect(result.recommendation.content).toEqual(expect.stringContaining(
        "Consider alternative agents. If using azathioprine start with"));
  });

  it('Should fail if no phenotype', () => {
    inputList.TPMT = { "diplotype":"*1/*1" };
    let result = dosingrecommendation(inputList);
    expect(result).toEqual("Incorrect/invalid input.");
  });

  it('Should fail if unrecognized phenotype', () => {
    inputList.TPMT = { "diplotype":"*1/*1", "phenotype":"Amazing metabolizer" };
    let result = dosingrecommendation(inputList);
    expect(result).toEqual("Incorrect/invalid input for drug azathioprine");
  });

  it('Should fail if no TPMT gene in list', () => {
    inputList.UGT1A2 = { "diplotype":"*1/*1", "phenotype":"Amazing metabolizer" };
    let result = dosingrecommendation(inputList);
    expect(result).toEqual("Incorrect/invalid input for drug azathioprine");
  });

  it('Should ignore other gene fields', () => {
    inputList.TPMT = { "diplotype":"*1/*1", "phenotype":"Normal metabolizer" };
    inputList.UGT1A2 = { "diplotype":"*1/*1", "phenotype":"Poor metabolizer" };
    let result = dosingrecommendation(inputList);
    expect(result.recommendation.implication).toEqual(
        "");
  });

});
