// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { SepoliaConfig } from "@fhevm/solidity/config/ZamaConfig.sol";
import { euint32, externalEuint32, euint8, ebool, FHE } from "@fhevm/solidity/lib/FHE.sol";

contract HealthLockbox is SepoliaConfig {
    using FHE for *;
    
    struct PatientRecord {
        euint32 recordId;
        euint32 patientId;
        euint32 age;
        euint8 bloodType;
        euint32 weight;
        euint32 height;
        ebool isActive;
        ebool isVerified;
        string name;
        string diagnosis;
        string treatment;
        address doctor;
        address patient;
        uint256 createdAt;
        uint256 updatedAt;
    }
    
    struct MedicalTest {
        euint32 testId;
        euint32 recordId;
        euint32 testType;
        euint32 result;
        ebool isNormal;
        string testName;
        string description;
        address lab;
        uint256 timestamp;
    }
    
    struct Prescription {
        euint32 prescriptionId;
        euint32 recordId;
        euint32 medicationId;
        euint32 dosage;
        euint32 frequency;
        ebool isActive;
        string medicationName;
        string instructions;
        address doctor;
        uint256 prescribedAt;
        uint256 expiresAt;
    }
    
    struct AccessLog {
        euint32 logId;
        euint32 recordId;
        address accessor;
        euint8 accessType; // 1: view, 2: edit, 3: share
        ebool isGranted;
        uint256 timestamp;
    }
    
    mapping(uint256 => PatientRecord) public patientRecords;
    mapping(uint256 => MedicalTest) public medicalTests;
    mapping(uint256 => Prescription) public prescriptions;
    mapping(uint256 => AccessLog) public accessLogs;
    mapping(address => euint32) public doctorReputation;
    mapping(address => euint32) public patientReputation;
    mapping(address => ebool) public authorizedDoctors;
    mapping(address => ebool) public authorizedLabs;
    
    uint256 public recordCounter;
    uint256 public testCounter;
    uint256 public prescriptionCounter;
    uint256 public logCounter;
    
    address public owner;
    address public verifier;
    
    event RecordCreated(uint256 indexed recordId, address indexed patient, address indexed doctor);
    event TestAdded(uint256 indexed testId, uint256 indexed recordId, address indexed lab);
    event PrescriptionAdded(uint256 indexed prescriptionId, uint256 indexed recordId, address indexed doctor);
    event AccessGranted(uint256 indexed logId, uint256 indexed recordId, address indexed accessor);
    event RecordVerified(uint256 indexed recordId, bool isVerified);
    event ReputationUpdated(address indexed user, uint32 reputation);
    
    constructor(address _verifier) {
        owner = msg.sender;
        verifier = _verifier;
    }
    
    function createPatientRecord(
        string memory _name,
        string memory _diagnosis,
        string memory _treatment,
        externalEuint32 _age,
        externalEuint32 _weight,
        externalEuint32 _height,
        externalEuint8 _bloodType,
        bytes calldata _ageProof,
        bytes calldata _weightProof,
        bytes calldata _heightProof,
        bytes calldata _bloodTypeProof
    ) public returns (uint256) {
        require(bytes(_name).length > 0, "Patient name cannot be empty");
        require(authorizedDoctors[msg.sender].decrypt() || msg.sender == owner, "Unauthorized doctor");
        
        uint256 recordId = recordCounter++;
        
        // Convert external encrypted values to internal
        euint32 internalAge = FHE.fromExternal(_age, _ageProof);
        euint32 internalWeight = FHE.fromExternal(_weight, _weightProof);
        euint32 internalHeight = FHE.fromExternal(_height, _heightProof);
        euint8 internalBloodType = FHE.fromExternal(_bloodType, _bloodTypeProof);
        
        patientRecords[recordId] = PatientRecord({
            recordId: FHE.asEuint32(0), // Will be set properly later
            patientId: FHE.asEuint32(0), // Will be set properly later
            age: internalAge,
            bloodType: internalBloodType,
            weight: internalWeight,
            height: internalHeight,
            isActive: FHE.asEbool(true),
            isVerified: FHE.asEbool(false),
            name: _name,
            diagnosis: _diagnosis,
            treatment: _treatment,
            doctor: msg.sender,
            patient: address(0), // Will be set when patient claims record
            createdAt: block.timestamp,
            updatedAt: block.timestamp
        });
        
        emit RecordCreated(recordId, address(0), msg.sender);
        return recordId;
    }
    
    function addMedicalTest(
        uint256 recordId,
        string memory _testName,
        string memory _description,
        externalEuint32 _testType,
        externalEuint32 _result,
        externalEbool _isNormal,
        bytes calldata _testTypeProof,
        bytes calldata _resultProof,
        bytes calldata _isNormalProof
    ) public returns (uint256) {
        require(patientRecords[recordId].doctor != address(0), "Record does not exist");
        require(authorizedLabs[msg.sender].decrypt() || msg.sender == owner, "Unauthorized lab");
        
        uint256 testId = testCounter++;
        
        // Convert external encrypted values to internal
        euint32 internalTestType = FHE.fromExternal(_testType, _testTypeProof);
        euint32 internalResult = FHE.fromExternal(_result, _resultProof);
        ebool internalIsNormal = FHE.fromExternal(_isNormal, _isNormalProof);
        
        medicalTests[testId] = MedicalTest({
            testId: FHE.asEuint32(0), // Will be set properly later
            recordId: FHE.asEuint32(recordId),
            testType: internalTestType,
            result: internalResult,
            isNormal: internalIsNormal,
            testName: _testName,
            description: _description,
            lab: msg.sender,
            timestamp: block.timestamp
        });
        
        emit TestAdded(testId, recordId, msg.sender);
        return testId;
    }
    
    function addPrescription(
        uint256 recordId,
        string memory _medicationName,
        string memory _instructions,
        externalEuint32 _medicationId,
        externalEuint32 _dosage,
        externalEuint32 _frequency,
        uint256 _expiresAt,
        bytes calldata _medicationIdProof,
        bytes calldata _dosageProof,
        bytes calldata _frequencyProof
    ) public returns (uint256) {
        require(patientRecords[recordId].doctor != address(0), "Record does not exist");
        require(authorizedDoctors[msg.sender].decrypt() || msg.sender == owner, "Unauthorized doctor");
        require(_expiresAt > block.timestamp, "Expiration must be in the future");
        
        uint256 prescriptionId = prescriptionCounter++;
        
        // Convert external encrypted values to internal
        euint32 internalMedicationId = FHE.fromExternal(_medicationId, _medicationIdProof);
        euint32 internalDosage = FHE.fromExternal(_dosage, _dosageProof);
        euint32 internalFrequency = FHE.fromExternal(_frequency, _frequencyProof);
        
        prescriptions[prescriptionId] = Prescription({
            prescriptionId: FHE.asEuint32(0), // Will be set properly later
            recordId: FHE.asEuint32(recordId),
            medicationId: internalMedicationId,
            dosage: internalDosage,
            frequency: internalFrequency,
            isActive: FHE.asEbool(true),
            medicationName: _medicationName,
            instructions: _instructions,
            doctor: msg.sender,
            prescribedAt: block.timestamp,
            expiresAt: _expiresAt
        });
        
        emit PrescriptionAdded(prescriptionId, recordId, msg.sender);
        return prescriptionId;
    }
    
    function grantAccess(
        uint256 recordId,
        address accessor,
        externalEuint8 _accessType,
        bytes calldata _accessTypeProof
    ) public returns (uint256) {
        require(patientRecords[recordId].doctor != address(0), "Record does not exist");
        require(
            patientRecords[recordId].doctor == msg.sender || 
            patientRecords[recordId].patient == msg.sender || 
            msg.sender == owner, 
            "Unauthorized access"
        );
        
        uint256 logId = logCounter++;
        
        // Convert external encrypted value to internal
        euint8 internalAccessType = FHE.fromExternal(_accessType, _accessTypeProof);
        
        accessLogs[logId] = AccessLog({
            logId: FHE.asEuint32(0), // Will be set properly later
            recordId: FHE.asEuint32(recordId),
            accessor: accessor,
            accessType: internalAccessType,
            isGranted: FHE.asEbool(true),
            timestamp: block.timestamp
        });
        
        emit AccessGranted(logId, recordId, accessor);
        return logId;
    }
    
    function verifyRecord(uint256 recordId, bool isVerified) public {
        require(msg.sender == verifier, "Only verifier can verify records");
        require(patientRecords[recordId].doctor != address(0), "Record does not exist");
        
        patientRecords[recordId].isVerified = FHE.asEbool(isVerified);
        emit RecordVerified(recordId, isVerified);
    }
    
    function updateReputation(address user, euint32 reputation) public {
        require(msg.sender == verifier, "Only verifier can update reputation");
        require(user != address(0), "Invalid user address");
        
        // Determine if user is doctor or patient based on context
        if (authorizedDoctors[user].decrypt()) {
            doctorReputation[user] = reputation;
        } else {
            patientReputation[user] = reputation;
        }
        
        emit ReputationUpdated(user, 0); // FHE.decrypt(reputation) - will be decrypted off-chain
    }
    
    function authorizeDoctor(address doctor, ebool isAuthorized) public {
        require(msg.sender == owner, "Only owner can authorize doctors");
        authorizedDoctors[doctor] = isAuthorized;
    }
    
    function authorizeLab(address lab, ebool isAuthorized) public {
        require(msg.sender == owner, "Only owner can authorize labs");
        authorizedLabs[lab] = isAuthorized;
    }
    
    function claimRecord(uint256 recordId, address patient) public {
        require(patientRecords[recordId].doctor != address(0), "Record does not exist");
        require(patientRecords[recordId].patient == address(0), "Record already claimed");
        require(msg.sender == owner || msg.sender == patient, "Unauthorized claim");
        
        patientRecords[recordId].patient = patient;
        patientRecords[recordId].updatedAt = block.timestamp;
    }
    
    // View functions that return decrypted values (to be called off-chain)
    function getRecordInfo(uint256 recordId) public view returns (
        string memory name,
        string memory diagnosis,
        string memory treatment,
        uint8 age,
        uint8 bloodType,
        uint8 weight,
        uint8 height,
        bool isActive,
        bool isVerified,
        address doctor,
        address patient,
        uint256 createdAt,
        uint256 updatedAt
    ) {
        PatientRecord storage record = patientRecords[recordId];
        return (
            record.name,
            record.diagnosis,
            record.treatment,
            0, // FHE.decrypt(record.age) - will be decrypted off-chain
            0, // FHE.decrypt(record.bloodType) - will be decrypted off-chain
            0, // FHE.decrypt(record.weight) - will be decrypted off-chain
            0, // FHE.decrypt(record.height) - will be decrypted off-chain
            record.isActive.decrypt(),
            record.isVerified.decrypt(),
            record.doctor,
            record.patient,
            record.createdAt,
            record.updatedAt
        );
    }
    
    function getTestInfo(uint256 testId) public view returns (
        uint8 testType,
        uint8 result,
        bool isNormal,
        string memory testName,
        string memory description,
        address lab,
        uint256 timestamp
    ) {
        MedicalTest storage test = medicalTests[testId];
        return (
            0, // FHE.decrypt(test.testType) - will be decrypted off-chain
            0, // FHE.decrypt(test.result) - will be decrypted off-chain
            test.isNormal.decrypt(),
            test.testName,
            test.description,
            test.lab,
            test.timestamp
        );
    }
    
    function getPrescriptionInfo(uint256 prescriptionId) public view returns (
        uint8 medicationId,
        uint8 dosage,
        uint8 frequency,
        bool isActive,
        string memory medicationName,
        string memory instructions,
        address doctor,
        uint256 prescribedAt,
        uint256 expiresAt
    ) {
        Prescription storage prescription = prescriptions[prescriptionId];
        return (
            0, // FHE.decrypt(prescription.medicationId) - will be decrypted off-chain
            0, // FHE.decrypt(prescription.dosage) - will be decrypted off-chain
            0, // FHE.decrypt(prescription.frequency) - will be decrypted off-chain
            prescription.isActive.decrypt(),
            prescription.medicationName,
            prescription.instructions,
            prescription.doctor,
            prescription.prescribedAt,
            prescription.expiresAt
        );
    }
    
    function getDoctorReputation(address doctor) public view returns (uint8) {
        return 0; // FHE.decrypt(doctorReputation[doctor]) - will be decrypted off-chain
    }
    
    function getPatientReputation(address patient) public view returns (uint8) {
        return 0; // FHE.decrypt(patientReputation[patient]) - will be decrypted off-chain
    }
    
    function isAuthorizedDoctor(address doctor) public view returns (bool) {
        return authorizedDoctors[doctor].decrypt();
    }
    
    function isAuthorizedLab(address lab) public view returns (bool) {
        return authorizedLabs[lab].decrypt();
    }
}
