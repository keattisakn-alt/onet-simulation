# Architecture Specification: Omnitrix Communication Network (ONet)

## 1. Project Overview
[cite_start]**Course:** Computer Networks CP352005 
[cite_start]**Project Name:** Omnitrix Communication Networks (ONet) 
[cite_start]**Group:** 3 
[cite_start]**Objective:** To design and simulate an alternative network architecture (ONet) that safely supports life-critical, biologically fluid systems where traditional TCP/IP protocols fail due to latency, identity spoofing, and best-effort delivery limitations[cite: 27, 34, 37].

## 2. Core Architectural Framework: "Bio-SCION"
The ONet architecture discards standard IP routing in favor of a hybrid approach combining Information-Centric Networking (ICN) and isolated trust domains.

### 2.1. Network Topology: SCION Isolation Domain (ISD)
* **Concept:** ONet operates as a private SCION Isolation Domain, cryptographically separated from the public internet. 
* **Purpose:** Prevents standard cyber-attacks (e.g., DDoS, BGP hijacking) on the public internet from affecting the life-critical biological control layer.


### 2.2. Data Transport: Named Data Networking (NDN)
* **Concept:** Routing is based on content names (e.g., `/ONet/DNA/Tetramand/v1`) rather than physical IP addresses.
* **Purpose:** Ensures high fault tolerance. If a primary server goes down, an Omnitrix node can fetch the required biological data from any nearby peer node that has cached it.

### 2.3. The "State Capsule" (Bio-Packet)
* [cite_start]**Structure:** Replaces traditional TCP/IP packets with atomic NDN Data Packets[cite: 50].
* **Payload:** Contains the biological sequence (DNA) and constraint policies (environmental limits).
* **Security:** Every packet is cryptographically signed at the data level, making the data itself self-verifying.


## 3. Governance and Security Model
The network utilizes a **Capability-Based Security** model divided into two tiers:
* [cite_start]**Tier 1: Local Authority (Emergency Actions):** For zero-latency transformations, the device uses pre-cached capability tokens[cite: 53]. It does not require a network connection to execute a transformation, ensuring safety during a network partition.
* [cite_start]**Tier 2: Federated Consensus (Administrative Actions):** To unlock a new DNA sequence (Alien Species Preservation System [cite: 56]), the network requires a distributed consensus (e.g., PBFT) among trusted nodes to verify ethical compliance before issuing a new capability token.

## 4. Simulation Scope (ns-3)
Since physical biological testing is impossible, the architecture will be validated via the **ns-3 network simulator** using the **ndnSIM** module. The simulation will measure:
1.  Packet delivery success rates during node mobility.
2.  Latency of local execution vs. federated consensus.
3.  Network partition resilience (mesh fallback).