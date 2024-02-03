pragma solidity ^0.8.0;

import "./EducationalInstitution.sol";

contract Employer {
    EducationalInstitution private educationalInstitution;
    address private instituionAddress;

    constructor(address _institutionAddress) {
        educationalInstitution = EducationalInstitution(_institutionAddress);
        instituionAddress = _institutionAddress;
    }

//    mapping(address => EmployerInfo) public employerInfo;
//
//    struct EmployerInfo {
//        string name;
//        string contactPerson;
//        string email;
//        string businessLicenseNumber;
//        bool isRegistered;
//    }
//    event EmployerRegistered(address indexed employerAddress, string name);
//
//    function registerEmployer(string memory name, string memory contactPerson, string memory email, string memory businessLicenseNumber) public {
//        require(!employerInfo[msg.sender].isRegistered, "Employer already registered");
//        employerInfo[msg.sender] = EmployerInfo(name, contactPerson, email, businessLicenseNumber, true);
//        emit EmployerRegistered(msg.sender, name);
//    }

    function verifyDegree(address student, uint256 tokenId) external view returns (bool) {
        require(educationalInstitution.ownerOf(tokenId) == student, string(abi.encodePacked("Token not owned by student: ", student)));
        return true;
    }

    function queryDegree(address student, uint256 tokenId) public view returns (EducationalInstitution.DegreeData memory) {
        return educationalInstitution.queryDegree(student, tokenId);
    }
}