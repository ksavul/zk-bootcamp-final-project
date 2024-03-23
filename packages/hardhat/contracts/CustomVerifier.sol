// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.4;

import { UltraVerifier } from "./plonk_vk.sol";

contract CustomVerifier is UltraVerifier {
	function getContractBytecode(
		address contractAddress
	) public view returns (bytes memory) {
		uint256 size;
		assembly {
			size := extcodesize(contractAddress)
		}

		bytes memory bytecode = new bytes(size);
		assembly {
			extcodecopy(contractAddress, add(bytecode, 32), 0, size)
		}

		return bytecode;
	}
}
