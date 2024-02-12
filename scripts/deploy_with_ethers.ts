// This script can be used to deploy the "Storage" contract using ethers.js library.
// Please make sure to compile "./contracts/1_Storage.sol" file before running this script.
// And use Right click -> "Run" from context menu of the file to run the script. Shortcut: Ctrl+Shift+S

import { deploy } from './ethers-lib'
import { ethers } from 'ethers';
(async () => {
  try {
    const institution = await deploy('EducationalInstitution', [],0)
    console.log(`institution deployed, instituion address: ${institution.address}`)
    const employer = await deploy("Employer",[institution.address],1)
    console.log(`employer deployed, init with institution ${institution.address}, employer address: ${employer.address}`)
    const student1 = await deploy("Student", [institution.address],2)
    console.log(`student Alice deployed, init with institution ${institution.address}, Alice address: ${student1.address}`)
    const student2 = await deploy("Student", [institution.address],3)
    console.log(`student Bob deployed, init with institution ${institution.address}, Bob address: ${student2.address}`)
    institution.registerEmployer(employer.address)
    console.log('institution register employer as trusted')
    const stu1_address = ethers.utils.getAddress(student1.address)
    const stu2_address = ethers.utils.getAddress(student2.address)
    await institution.issueDegree(stu1_address,"NTU","B+","SPMS","Alice")
    console.log('institution issueDegree for Alice: school=NTU, GPA=B+, department=SPMS, name=Alice')
    await institution.issueDegree(stu2_address,"NUS","B+","CS","Bob")
    console.log('institution issueDegree for Bob: school=NUS, GPA=B+, department=CS, name=Bob')
    const stu1_tokens = await student1.getTokens()
    const stu2_tokens = await student2.getTokens()
    for(let i = 0;i < stu1_tokens.length;i++) {
      const result1_a = await employer.queryDegree(stu1_address, stu1_tokens[i])
      console.log("verify employer query result for Alice:",result1_a)
      const result2_a = await student1.queryDegree(stu1_address, stu1_tokens[i])
      console.log("verify student self-query result for Alice:",result2_a)
    }
    for(let i = 0;i < stu2_tokens.length;i++) {
      const result1_b = await employer.queryDegree(stu2_address, stu2_tokens[i])
      console.log("verify employer query result for Bob:",result1_b)
      const result2_b = await student2.queryDegree(stu2_address, stu2_tokens[i])
      console.log("verify student self-query result for Bob:",result2_b)
    }
  } catch (e) {
    console.log(e.message)
  }
})()