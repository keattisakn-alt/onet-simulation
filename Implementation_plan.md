# Implementation & Simulation Plan

**Timeframe:** 4 Weeks
**Team Size:** 5 Members

## 1. Team Roles & Responsibilities
[cite_start]To maximize efficiency, the workload is distributed among the 5 group members[cite: 5, 6]:
* **Project Manager & System Architect (Kiattisak Nantarat):** Oversees the overall architectural integration, manages the GitHub repository, and finalizes the architecture spec.
* **NDN Protocol Specialist (Supawat Kaitong):** Configures the `ndnSIM` environment, defines the naming conventions (`/ONet/DNA/...`), and constructs the State Capsule packet structures.
* **Security & Consensus Engineer (Pakin Meksuwan):** Designs the simulation logic for capability-based security and the PBFT consensus delay for the Alien Species Preservation System.
* **ns-3 Simulation Engineer 1 (Nakarin Na Ranong):** Builds the federated mesh topology in C++/Python, configuring node mobility models and link properties (bandwidth, delay).
* **ns-3 Simulation Engineer 2 (Sorawit Wansen):** Scripts the test scenarios (e.g., network partitions, node failures) and implements data collection for latency and packet loss metrics.

## 2. Weekly Sprint Schedule

### Week 1: Environment Setup & Baseline Topologies
* **Goal:** Establish the working environment and basic network graph.
* **Tasks:**
    * Install Linux (Ubuntu), **ns-3**, and the **ndnSIM** module on all team members' machines.
    * Define the mesh network topology (e.g., 10 mobile Omnitrix nodes, 3 static "Plumber" consensus nodes).
    * Draft the baseline TCP/IP simulation to serve as a failure comparison.
* **Deliverable:** A running "Hello World" simulation in ndnSIM.

### Week 2: Protocol Implementation (State Capsules)
* **Goal:** Implement the core NDN routing logic.
* **Tasks:**
    * Create the custom NDN Interest and Data packets representing the "State Capsules".
    * Implement in-network caching so mobile nodes can share DNA packets without hitting the central server.
    * Write scripts to simulate a node requesting a transformation (fetching a DNA packet).
* **Deliverable:** A successful packet exchange demonstrating content-based routing rather than IP-based routing.

### Week 3: Edge Cases, Security & Network Partitions
* **Goal:** Test the life-critical resilience of the ONet.
* **Tasks:**
    * **Scenario A (Network Partition):** Program a sudden link failure isolating an Omnitrix node. Verify that local cached transformations still execute with zero latency.
    * **Scenario B (Federated Consensus):** Simulate a node requesting a *new* alien. Introduce an artificial processing delay to simulate the PBFT consensus among the 3 static nodes before sending the Data packet.
* **Deliverable:** Trace files (`.pcap` or `.tr`) capturing the network's behavior under stress.

### Week 4: Data Analysis, Reporting & Presentation
* **Goal:** Finalize metrics and prepare the project submission.
* **Tasks:**
    * Extract metric data (Throughput, Latency, Cache Hit Ratio) from ns-3 output files.
    * Generate graphs comparing ONet's mesh resilience against standard TCP/IP routing.
    * Compile the final term paper detailing the theoretical concepts and the simulation results.
    * [cite_start]Record the final video presentation[cite: 7].
* **Deliverable:** Completed `Architecture_spec.md`, final codebase, metric graphs, and presentation video.