pragma solidity ^0.8.0;

import "./EducationalInstitution.sol";

contract Employer {
    EducationalInstitution educationalInstitution;

    constructor(address institutionAddress) {
        educationalInstitution = EducationalInstitution(institutionAddress);
    }

    function verifyDegree(address student, uint256 tokenId) external view returns (bool) {
        return educationalInstitution.ownerOf(tokenId) == student;
    }
}
