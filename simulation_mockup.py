import time
import random

class OmnitrixNode:
    def __init__(self, node_id, is_connected=True):
        self.node_id = node_id
        self.local_cache = {"/ONet/DNA/Tetramand/v1", "/ONet/DNA/Pyronite/v1"}
        self.is_connected = is_connected

    def request_transformation(self, dna_sequence, network):
        print(f"\n[Node {self.node_id}] Requesting transformation to {dna_sequence}...")
        start_time = time.time()
        
        # Tier 1: Local Authority (Emergency Actions)
        if dna_sequence in self.local_cache:
            latency = random.uniform(0.001, 0.005) # Very low latency
            time.sleep(latency)
            print(f"[Node {self.node_id}] SUCCESS: Local cache hit. Zero-latency transformation executed.")
            print(f"[Node {self.node_id}] Latency: {latency*1000:.2f} ms")
            return
            
        # Network Partition Check
        if not self.is_connected:
            print(f"[Node {self.node_id}] FAILED: Network partition detected. Cannot reach consensus nodes.")
            return

        # Tier 2: Federated Consensus (Administrative Actions)
        print(f"[Node {self.node_id}] Cache miss. Initiating Federated Consensus with Plumber Nodes...")
        success, latency = network.run_pbft_consensus(dna_sequence)
        
        if success:
            self.local_cache.add(dna_sequence)
            print(f"[Node {self.node_id}] SUCCESS: Consensus achieved. New capability token issued.")
            print(f"[Node {self.node_id}] Latency: {latency*1000:.2f} ms")
        else:
            print(f"[Node {self.node_id}] FAILED: Consensus rejected the request.")


class ONetNetwork:
    def __init__(self, plumber_nodes_count=3):
        self.plumber_nodes_count = plumber_nodes_count

    def run_pbft_consensus(self, dna_sequence):
        # Simulating network latency and PBFT consensus calculation
        network_delay = random.uniform(0.05, 0.15)
        consensus_delay = random.uniform(0.1, 0.3)
        total_latency = network_delay + consensus_delay
        time.sleep(total_latency)
        
        # Simulate 95% approval rate for valid sequences
        approved = random.random() < 0.95
        return approved, total_latency


def run_simulation():
    print("=== ONet Bio-SCION Architecture Simulation Toy Model ===")
    network = ONetNetwork()
    
    # Create nodes
    node1 = OmnitrixNode("Ben-01", is_connected=True)
    node2 = OmnitrixNode("Gwen-02", is_connected=False) # Isolated node
    
    # Scenario 1: Local Execution (Zero-latency)
    print("\n--- Scenario 1: Local Execution (Cached DNA) ---")
    node1.request_transformation("/ONet/DNA/Tetramand/v1", network)
    
    # Scenario 2: Federated Consensus (New Alien)
    print("\n--- Scenario 2: Federated Consensus (New Alien) ---")
    node1.request_transformation("/ONet/DNA/Galvan/v1", network)
    
    # Scenario 3: Network Partition Resilience
    print("\n--- Scenario 3: Network Partition (Isolated Node) ---")
    node2.request_transformation("/ONet/DNA/Tetramand/v1", network) # Cached - should work
    node2.request_transformation("/ONet/DNA/Kineceleran/v1", network) # Not cached - should fail

if __name__ == "__main__":
    run_simulation()
