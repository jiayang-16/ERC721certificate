// This script can be used to deploy the "Storage" contract using ethers.js library.
// Please make sure to compile "./contracts/1_Storage.sol" file before running this script.
// And use Right click -> "Run" from context menu of the file to run the script. Shortcut: Ctrl+Shift+S

import { deploy } from './ethers-lib'
import { ethers } from 'ethers';
(async () => {
  try {
    const institution = await deploy('EducationalInstitution', [],0)
    console.log(`address: ${institution.address}`)
    const employer = await deploy("Employer",[institution.address],1)
    console.log(`address: ${employer.address}`)
    const student1 = await deploy("Student", [institution.address],2)
    console.log(`address: ${student1.address}`)
    const student2 = await deploy("Student", [institution.address],3)
    console.log(`address: ${student2.address}`)
    institution.registerEmployer(employer.address)
    const stu1_address = ethers.utils.getAddress(student1.address)
    const stu2_address = ethers.utils.getAddress(student2.address)
    await institution.issueDegree(stu1_address,"NTU","B+","SPMS","Alice")
    await institution.issueDegree(stu2_address,"NUS","B+","CS","Bob")
    const stu1_tokens = await student1.getTokens()
    // const stu2_tokens = await student2.getTokens()
    for(let i = 0;i < stu1_tokens.length;i++) {
      console.log("token_id:",stu1_tokens[i])
      const result1 = await employer.queryDegree(stu1_address, stu1_tokens[i])
      console.log("verify employer query result:",result1)
      const result2 = await student1.queryDegree(stu1_address, stu1_tokens[i])
      console.log("verify student query result:",result2)
    }
  } catch (e) {
    console.log(e.message)
  }
})()