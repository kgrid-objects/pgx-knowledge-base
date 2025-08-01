function dosingrecommendation (inputs) {
  try {
    var genes = {}
    var output = {}
    var searchkeyReady = true
    var phenotypesValue = ''
    var lowercaseInput = {}
    var searchKey = ''
    var targetfield =''
    for(var inputkey in inputs){
      var key = inputkey.toLowerCase()
      lowercaseInput[key]=inputs[inputkey]
    }
    for(var genekey in reference) {
      key = genekey.toLowerCase()
      if(!lowercaseInput[key]) {
        break
      }
      genes[genekey]={}
      genes[genekey].diplotype = lowercaseInput[key].diplotype || ''
      genes[genekey].phenotype = lowercaseInput[key].phenotype || ''
      genes[genekey].phenotype = genes[genekey].phenotype.toLowerCase()
      targetfield = reference[genekey].field
      searchkeyReady = searchkeyReady && (genes[genekey][targetfield]!='')
      if(targetfield=='diplotype'){
        if (genes[genekey].diplotype.indexOf(reference[genekey].value) != -1) {
          searchKey = searchKey+genekey.toLowerCase()+reference[genekey].value+keysuffix[genekey].positive
        } else {
          searchKey = searchKey+ genekey.toLowerCase()+reference[genekey].value+keysuffix[genekey].negative
        }
      }
      if(targetfield=='phenotype'){
        if (genes[genekey].phenotype != "") {
          searchKey = searchKey+genekey.toLowerCase()+genes[genekey].phenotype.replace('metabolizer','').replace(' ','').replace('activity','').replace('function','')
        }
      }
    }
    if (searchkeyReady) {
      if(recommendations[searchKey]!=null){
        output.type='CPIC Recommendation'
        output.drug=drug
        output["genes"] = JSON.parse(JSON.stringify(genes))
        output.recommendation={}
        output.recommendation.implication=recommendations[searchKey].implication
        output.recommendation.content=recommendations[searchKey].recommendation
        output.recommendation.classification=recommendations[searchKey].classification
        return output
      } else {
        return "Incorrect/invalid input for drug " + drug
      }
    }else {
      return "Incorrect/invalid input."
    }
  } catch(error){
    return 'Error: '+ error
  }
}

// KGrid CPIC guidelines SLCO1B1 Phenotype to Clopidogrel Recommendation
var drug = 'simvastatin'
var reference = {'SLCO1B1':{field:'phenotype', value:''}}

var recommendations = {
  'slco1b1normal': {'implication': 'Normal myopathy risk',
                  'recommendation': 'Prescribe desired starting dose and adjust doses of simvastatin based on disease-specific guidelines',
                  'classification': 'Strong'},
  'slco1b1intermediate': {'implication': 'Intermediate myopathy risk',
          'recommendation': 'Prescribe a lower dose or consider an alternative statin (e.g., pravastatin or rosuvastatin); consider routine CK surveillance',
          'classification': 'Strong'},
  'slco1b1low': {'implication': 'High myopathy risk',
          'recommendation': 'Prescribe a lower dose or consider an alternative statin (e.g., pravastatin or rosuvastatin); consider routine CK surveillance.',
          'classification': 'Strong'}}

export { dosingrecommendation };
