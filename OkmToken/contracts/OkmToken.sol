// SPDX-License-Identifier: MIT

pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract OkmToken is ERC20 {

     address public owner;
     struct LockInfo {
        uint256 amount;
        uint256 releaseTime;
    }

    mapping(address => LockInfo[]) private _tokenLocks;
    mapping(address => uint256) _balances;

    event TokenLocked(address indexed beneficiary, uint256 amount, uint256 releaseTime);
    event TokenUnlocked(address indexed beneficiary, uint256 amount);

    constructor() ERC20('Okm Token', 'OKT') {
        owner = msg.sender;
        _mint(msg.sender, 10000 * (10 ** decimals()));
    }

    function mint(address to, uint amount) external {
        require(msg.sender == owner, "only owner");
        _mint(to, amount);
    }

    function burn(uint amount) external {
        _burn(msg.sender, amount);
    }

    
    function lockTokens(address beneficiary, uint256 amount, uint256 releaseTime) external {
        require(releaseTime > block.timestamp, "Release time must be in the future");
        require(amount <= balanceOf(msg.sender), "Insufficient balance");

        _tokenLocks[beneficiary].push(LockInfo(amount, releaseTime));
        _transfer(msg.sender, address(this), amount);

        emit TokenLocked(beneficiary, amount, releaseTime);
    }

    function unlockTokens(uint256 index) external {
        require(index < _tokenLocks[msg.sender].length, "Invalid lock index");
        LockInfo storage lock = _tokenLocks[msg.sender][index];
        require(block.timestamp >= lock.releaseTime, "Tokens are still locked");

        uint256 amount = lock.amount;
        delete _tokenLocks[msg.sender][index];

        _transfer(address(this), msg.sender, amount);

        emit TokenUnlocked(msg.sender, amount);
    }

    function transfer(address _to, uint256 _value) public override returns(bool) {
        require((_balances[msg.sender] >= _value) && (_balances[msg.sender] > 0), "!Bal");
        _balances[msg.sender] -= _value;
        _balances[_to] += _value;

        emit Transfer(msg.sender, _to, _value);
        return true;
    }
}
