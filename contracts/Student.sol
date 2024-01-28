pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
contract Student is IERC721Receiver {
    // address public owner;
    address public institution;
    uint256 [] private tokens;

    constructor(address _institution) {
        // owner = msg.sender;
        institution = _institution;
    }

    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) external override returns (bytes4) {
        require(msg.sender==institution,"only accept token from institution");
        tokens.push(tokenId);
        return IERC721Receiver.onERC721Received.selector;
    }

    function getTokens() public view returns (uint256[] memory) {
        return tokens;
    }
}