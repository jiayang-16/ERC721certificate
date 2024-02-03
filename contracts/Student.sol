pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "./EducationalInstitution.sol";

contract Student is IERC721Receiver {
    // address public owner;
    uint256 [] private tokens;

    EducationalInstitution private educationalInstitution;
    address private instituionAddress;

    constructor(address _institutionAddress) {
        educationalInstitution = EducationalInstitution(_institutionAddress);
        instituionAddress = _institutionAddress;
    }

    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) external override returns (bytes4) {
        require(msg.sender==instituionAddress,"only accept token from institution");
        tokens.push(tokenId);
        return IERC721Receiver.onERC721Received.selector;
    }

    function getTokens() public view returns (uint256[] memory) {
        return tokens;
    }

    function queryDegree(address student, uint256 tokenId) public view returns (EducationalInstitution.DegreeData memory) {
        return educationalInstitution.queryDegree(student, tokenId);
    }
}