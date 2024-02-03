pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract EducationalInstitution is ERC721 {

    struct DegreeData {
        string school;
        string grade;
        string department;
        string student;
    }

    int private nounce;
    address private owner;
    mapping (uint256=>DegreeData) private degrees;
    mapping(address => bool) private employers;

    constructor() ERC721("DegreeToken", "DGT") {
        owner = msg.sender;
        nounce = 0;
    }

    function issueDegree(address student,
    string memory school,
    string memory grade,
    string memory department,
    string memory name) public {
        require(msg.sender==owner,"only the institution can issue degree");
        uint256 tokenId = uint256(generateUniqueId());
        degrees[tokenId] = DegreeData(school, grade, department, name);
        _safeMint(student, tokenId);
    }

    function registerEmployer(address employerAddress) public {
        require(msg.sender == owner, "only the institution can register employer");
        employers[employerAddress] = true;
    }

    function queryDegree(address student, uint256 tokenId) public view returns (DegreeData memory) {
        require(student == ownerOf(tokenId), "student is not the owner of tokenId");
        require(msg.sender == student || employers[msg.sender] == true || msg.sender == owner, "query unauthorized");
        return degrees[tokenId];
    }

    function generateUniqueId() public returns (bytes32) {
        nounce += 1;
        return keccak256(abi.encodePacked(block.timestamp, msg.sender, nounce));
    }
}