// SPDX-License-Identifier: GPL-3.0
        
pragma solidity >=0.4.22 <0.9.0;

// This import is automatically injected by Remix
import "remix_tests.sol"; 

// This import is required to use custom transaction context
// Although it may fail compilation in 'Solidity Compiler' plugin
// But it will work fine in 'Solidity Unit Testing' plugin
import "remix_tests.sol"; 
import "remix_accounts.sol";
import "../contracts/EducationalInstitution.sol";
import "../contracts/Employer.sol";
import "../contracts/Student.sol";

contract EducationalInstitutionTest {
    EducationalInstitution institution;
    Employer employer;
    Student student1;
    Student student2;
    address owner = TestsAccounts.getAccount(0);

    function beforeAll() public {
        institution = new EducationalInstitution();
        employer = new Employer(address(institution));
        student1 = new Student(address(institution));
        student2 = new Student(address(institution));
    }

    function issueDegreeSuccessfully() public {
        try institution.issueDegree(address(student1), "NTU", "B+", "SPMS", "Alice") {
            Assert.ok(true, "Degree issued successfully");
        } catch {
            Assert.ok(false, "Degree issuance failed");
        }
    }

    function checkDuplicateDegreeIssuance() public {
        bool r;
        (r, ) = address(institution).call(abi.encodeWithSelector(institution.issueDegree.selector, address(student1), "NTU", "B+", "SPMS", "Alice"));
        Assert.ok(!r, "Should not issue the same degree twice");
    }


    function issueDegreeToInvalidAddress() public {
        try institution.issueDegree(address(0), "NUS", "A", "Engineering", "Eve") {
            Assert.ok(false, "Should fail issuing degree to an invalid address");
        } catch {
            Assert.ok(true, "Correctly handled issuing degree to an invalid address");
        }
    }
    
    

     function queryNonexistentDegree() public {
    // 假设`queryDegree`函数需要学生地址和学位ID作为参数
    address dummyStudentAddress = address(0); // 使用一个虚构的学生地址
    uint256 nonexistentDegreeId = 9999; // 使用一个不存在的学位ID

    try institution.queryDegree(dummyStudentAddress, nonexistentDegreeId) {
        Assert.ok(false, "Querying a non-existent degree should not succeed");
    } catch {
        Assert.ok(true, "Correctly handled querying a non-existent degree");
    }
}
     

    

}
    
