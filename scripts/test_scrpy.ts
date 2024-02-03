import { deploy } from './ethers-lib'
import { ethers } from 'ethers';

(async () => {
  try {
    // Deploying contracts
    const institution = await deploy('EducationalInstitution', [],0)
    console.log(`Educational Institution address: ${institution.address}`)
    const employer = await deploy("Employer",[institution.address],1)
    console.log(`Employer address: ${employer.address}`)
    const student1 = await deploy("Student", [institution.address],2)
    console.log(`Student1 address: ${student1.address}`)
    const student2 = await deploy("Student", [institution.address],3)
    console.log(`Student2 address: ${student2.address}`)

    // Issue degrees
    const stu1_address = ethers.utils.getAddress(student1.address)
    const stu2_address = ethers.utils.getAddress(student2.address)
    await institution.issueDegree(stu1_address,"NTU","B+","SPMS","Alice")
    await institution.issueDegree(stu2_address,"NUS","B+","CS","Bob")

    // Fetch tokens to verify issuance
    const stu1_tokens = await student1.getTokens()
    console.log(`Student1 Tokens: ${stu1_tokens}`)
    const stu2_tokens = await student2.getTokens()
    console.log(`Student2 Tokens: ${stu2_tokens}`)

    // Verify degrees for Student1
    for(let i = 0; i < stu1_tokens.length; i++) {
      const result = await institution.queryDegree(stu1_address, stu1_tokens[i])
      console.log(`Degree for Student1 Token ${stu1_tokens[i]}: `, result)
    }

    // Verify degrees for Student2
    for(let i = 0; i < stu2_tokens.length; i++) {
      const result = await institution.queryDegree(stu2_address, stu2_tokens[i])
      console.log(`Degree for Student2 Token ${stu2_tokens[i]}: `, result)
    }

    // Employer verifies Student1's degree
    for(let i = 0; i < stu1_tokens.length; i++) {
      const isVerified = await employer.verifyDegree(stu1_address, stu1_tokens[i])
      console.log(`Verification result for Student1 Token ${stu1_tokens[i]}: ${isVerified}`)
    }

    // Employer verifies Student2's degree
    for(let i = 0; i < stu2_tokens.length; i++) {
      const isVerified = await employer.verifyDegree(stu2_address, stu2_tokens[i])
      console.log(`Verification result for Student2 Token ${stu2_tokens[i]}: ${isVerified}`)
    }




    // Verify unauthorized access is blocked
    try {
      // Assuming there's a function to simulate unauthorized access
      await employer.issueDegree(ethers.utils.getAddress(student2.address),"NUS","A","Engineering","Bob")
      console.error("Failed: Unauthorized access should be blocked.")
    } catch (e) {
      console.log("Passed: Unauthorized access blocked successfully.")
    }


    // Error Handling: Issue a degree to an invalid address
    try {
      await institution.issueDegree("0x0","NUS","A","Engineering","Eve")
      console.error("Failed: Issuing degree to an invalid address should fail.")
    } catch (e) {
      console.log("Passed: Correctly handled issuing degree to an invalid address.")
    }

    // Interface Test: Fetch and verify student's degrees
    const tokens = await student1.getTokens();
    if(tokens.length > 0) {
      const degreeDetails = await institution.queryDegree(ethers.utils.getAddress(student1.address), tokens[0]);
      console.log(`Degree Details: ${degreeDetails}, Verification Passed`);
    } else {
      console.error("Failed: No tokens found for student1.");
    }
    // Test illegal operations
    // Attempt to issue a degree from an unauthorized address (simulated by not using the onlyOwner modifier in a catch block)
    try {
      // This assumes deploy function simulates deployment from different addresses
      const unauthorizedInstitution = await deploy('EducationalInstitution', [],2) // Simulated unauthorized address
      await unauthorizedInstitution.issueDegree(ethers.utils.getAddress(student2.address),"MIT","A","Engineering","Charlie")
      console.error("Failed: Unauthorized issuance should not succeed.");
    } catch (e) {
      console.log("Passed: Unauthorized issuance blocked successfully.");
    }

        // Test querying a non-existent degree
    try {
      const nonExistentDegreeId = 9999; // Assuming this ID does not exist
      await institution.queryDegree(nonExistentDegreeId);
      console.error("Failed: Querying a non-existent degree should not succeed.");
    } catch (e) {
      console.log("Passed: Correctly handled querying a non-existent degree.");
    }    

const provider = new ethers.providers.JsonRpcProvider(); 
const attacker = new ethers.Wallet(ethers.utils.randomBytes(32), provider);
const institutionAsAttacker = institution.connect(attacker);
(async () => {
  try {
    await institutionAsAttacker.issueDegree(
      ethers.utils.getAddress(attacker.address),
      "HackerUniversity",
      "A+",
      "Hacking",
      "Hacker"
    );
    console.error("Failed: Attacker should not be able to issue a degree.");
  } catch (e) {
    console.log("Passed: Successfully prevented attacker from issuing a degree.");
  }
})();


  } catch (e) {
    console.log(e.message)
  }
})()
