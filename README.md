# ⬡ ONet — Omnitrix Communication Network

> **โปรเจกต์วิชา Computer Networks (CP352005) — กลุ่มที่ 3**

สถาปัตยกรรมเครือข่ายทางเลือก **"Bio-SCION"** ที่ออกแบบมาเพื่อรองรับระบบชีวภาพที่สำคัญต่อชีวิต (life-critical biological systems) โดยแก้ไขข้อจำกัดของ TCP/IP แบบดั้งเดิม ทั้งด้าน latency, การปลอมแปลงตัวตน (identity spoofing) และการส่งข้อมูลแบบ best-effort

---

## 📋 สารบัญ

- [ภาพรวมโปรเจกต์](#-ภาพรวมโปรเจกต์)
- [สถาปัตยกรรม Bio-SCION](#-สถาปัตยกรรม-bio-scion)
- [โครงสร้างไฟล์](#-โครงสร้างไฟล์)
- [เทคโนโลยีที่ใช้](#-เทคโนโลยีที่ใช้)
- [หน้าเว็บไซต์](#-หน้าเว็บไซต์)
- [การจำลองเครือข่าย (Simulation)](#-การจำลองเครือข่าย-simulation)
- [ผลลัพธ์การจำลอง](#-ผลลัพธ์การจำลอง)
- [วิธีการใช้งาน](#-วิธีการใช้งาน)
- [แผนการดำเนินงาน](#-แผนการดำเนินงาน)
- [สมาชิกกลุ่มและหน้าที่](#-สมาชิกกลุ่มและหน้าที่)

---

## 🧬 ภาพรวมโปรเจกต์

**ONet (Omnitrix Communication Network)** เป็นโปรเจกต์ออกแบบและจำลองสถาปัตยกรรมเครือข่ายทางเลือกที่รองรับระบบชีวภาพที่สำคัญต่อชีวิตได้อย่างปลอดภัย ในสถานการณ์ที่โปรโตคอล TCP/IP แบบดั้งเดิมไม่สามารถตอบสนองได้อย่างเพียงพอ

### ปัญหาของ TCP/IP
| ปัญหา | ผลกระทบ |
|---|---|
| High Latency | ไม่เหมาะสำหรับระบบที่ต้องการ real-time response |
| Identity Spoofing | เสี่ยงต่อการปลอมแปลงตัวตนบนเครือข่าย |
| Best-effort Delivery | ไม่รับประกันการส่งข้อมูลที่สำคัญต่อชีวิต |
| Single Point of Failure | Server กลาง 1 ตัวพัง = ระบบทั้งหมดล่ม |

### แนวทางของ ONet
ONet ใช้สถาปัตยกรรม **Bio-SCION** ที่ผสมผสาน **Information-Centric Networking (ICN)** กับ **Isolated Trust Domains** เพื่อสร้างเครือข่ายที่ปลอดภัย ทนทาน และตอบสนองได้ในเวลาจริง

---

## 🏗️ สถาปัตยกรรม Bio-SCION

### 1. SCION Isolation Domain (ISD)
- ทำงานเป็น **Private SCION Isolation Domain** ที่แยกออกจากอินเทอร์เน็ตสาธารณะด้วยการเข้ารหัส
- ป้องกันการโจมตีแบบ **DDoS** และ **BGP hijacking**
- ใช้ **Cryptographic Path Verification** ตรวจสอบเส้นทางข้อมูล

### 2. Named Data Networking (NDN)
- Routing อิงตาม **ชื่อเนื้อหา** (Content Names) เช่น `/ONet/DNA/Tetramand/v1` แทนที่ IP Address
- รองรับ **In-Network Caching** ให้ Node แชร์ข้อมูลกันแบบ Peer-to-Peer
- ทนทานต่อความผิดพลาดสูง — ไม่พึ่งพา Server ตัวเดียว

### 3. State Capsule (Bio-Packet)
- ใช้แทน TCP/IP Packet แบบดั้งเดิม ด้วย **NDN Data Packet แบบ Atomic**
- **Payload**: ลำดับชีวภาพ (DNA) + นโยบายข้อจำกัดด้านสิ่งแวดล้อม
- **Security**: ทุก Packet ถูก **เซ็นด้วยการเข้ารหัสในระดับข้อมูล** (Data-Level Signing) — ข้อมูลตรวจสอบตัวเองได้

### 4. Governance & Security Model
ระบบใช้ **Capability-Based Security** แบ่งเป็น 2 ระดับ:

| Tier | ชื่อ | การทำงาน |
|------|------|---------|
| **Tier 1** | Local Authority (Emergency) | ใช้ Capability Token ที่แคชไว้ล่วงหน้า ทำงานได้แม้ออฟไลน์ — Latency ~3 ms |
| **Tier 2** | Federated Consensus (Admin) | ใช้ PBFT Consensus จาก 3 Plumber Nodes เพื่อตรวจสอบจริยธรรมก่อนออก Token ใหม่ — Latency ~247 ms |

---

## 📁 โครงสร้างไฟล์

```
networkfinal/
├── README.md                          # ไฟล์นี้
├── pronetwork/
│   ├── Architecture_spec.md           # เอกสาร Architecture Specification
│   └── Implementation_plan.md         # แผนการดำเนินงานและบทบาทสมาชิก
└── pronetwork2/pronetwork/
    ├── index.html                     # หน้าหลัก — Architecture Overview
    ├── plan.html                      # หน้า Implementation Plan & Team
    ├── simulation.html                # หน้าจำลองเครือข่ายแบบ Interactive
    ├── results.html                   # หน้าผลลัพธ์การจำลอง + Code Demos
    ├── styles.css                     # Design System (Dark Cyberpunk)
    ├── script.js                      # Simulation Engine + Animations
    └── simulation_mockup.py           # Python Simulation Toy Model
```

---

## 🛠️ เทคโนโลยีที่ใช้

| เทคโนโลยี | การใช้งาน |
|---|---|
| **HTML5** | โครงสร้างหน้าเว็บ (Semantic HTML) |
| **CSS3** | Design System แบบ Dark Cyberpunk พร้อม Glassmorphism, Gradient, Animation |
| **JavaScript (Vanilla)** | Simulation Engine, Interactive Demos, Scroll Animations |
| **Python** | Simulation Mockup (OmnitrixNode, ONetNetwork classes) |
| **Google Fonts** | Orbitron (หัวข้อ) + Inter (ตัวอักษรทั่วไป) |
| **ns-3 / ndnSIM** | เป้าหมายตัวจำลองเครือข่ายจริง (ใช้ในเอกสารและ Conceptual Design) |

---

## 🌐 หน้าเว็บไซต์

เว็บไซต์ประกอบด้วย **4 หน้าหลัก** พร้อม Navigation Bar ที่ใช้งานได้ทุกหน้า:

### 1. 🏠 Architecture (index.html)
- **Hero Section** — แนะนำโปรเจกต์ ONet
- **Project Overview** — อธิบายปัญหาของ TCP/IP ที่ ONet แก้ไข
- **Bio-SCION Framework** — อธิบาย ISD, NDN, State Capsule อย่างละเอียด
- **Security Model** — ระบบ Tier 1 (Local) และ Tier 2 (Federated Consensus)
- **Simulation Scope** — ขอบเขตการจำลอง (Delivery Rates, Latency, Partition Resilience)

### 2. 📋 Plan (plan.html)
- **Team Roles** — แสดงสมาชิกทั้ง 5 คนพร้อมอวาตาร์และหน้าที่
- **Weekly Sprints** — แผนงาน 4 สัปดาห์แบบ Timeline พร้อม Deliverables

### 3. 🎮 Simulation (simulation.html)
- **Interactive Canvas** — แสดง Network Topology (5 Nodes, Mesh Links)
- **7 Scenarios** — กดปุ่มเพื่อจำลองแต่ละสถานการณ์พร้อมแอนิเมชัน Packet Flow
- **Scenario Descriptions** — อธิบายแต่ละสถานการณ์อย่างละเอียด (ภาษาไทย)
- **Simulation Log** — แสดงผลลัพธ์แบบ Real-time

### 4. 📊 Results (results.html)
- **Key Metrics** — สรุป Avg Latency, Cache Hit Ratio, Packet Delivery, Consensus Latency
- **Interactive Code Demos** — 4 ตัวอย่างโค้ดเปรียบเทียบ ONet vs TCP/IP (กด Run ได้)
- **Latency Comparison Chart** — กราฟแท่งเปรียบเทียบ ONet กับ TCP/IP
- **Per-Scenario Analysis** — ตารางผลลัพธ์ 7 สถานการณ์
- **ONet vs TCP/IP Comparison** — เปรียบเทียบ 6 มิติ (Latency, Partition, Caching, Mobility, Security, Access Control)
- **Throughput & Packet Delivery** — แสดงผลด้วย Ring Charts
- **Conclusion** — สรุปผลการจำลองทั้งหมด

---

## 🎮 การจำลองเครือข่าย (Simulation)

### 7 สถานการณ์จำลอง

| # | สถานการณ์ | คำอธิบาย | ผลลัพธ์ที่คาดหวัง |
|---|---|---|---|
| **S1** | ⚡ Local Cache Hit | Node ดึงข้อมูลจากแคชภายใน | ✅ สำเร็จ — Latency ~3 ms |
| **S2** | 🤝 Federated Consensus | ปลดล็อก DNA ใหม่ผ่าน PBFT 3 nodes | ✅ สำเร็จ — Latency ~247 ms |
| **S3a** | 💔 Partition (Cached) | เครือข่ายขาด แต่ข้อมูลอยู่ในแคช | ✅ สำเร็จ — ใช้แคชได้ |
| **S3b** | 💔 Partition (Uncached) | เครือข่ายขาด ข้อมูลไม่อยู่ในแคช | ❌ ล้มเหลว — ต้องใช้ Consensus |
| **S4** | 📦 Peer Cache | Node แชร์ข้อมูลแบบ Peer-to-Peer | ✅ สำเร็จ — Latency ~22 ms |
| **S5** | 🚫 Consensus Rejection | ขอ DNA ของสิ่งมีชีวิตที่ถูกจำกัด | ⊘ ปฏิเสธ — ASPS Policy |
| **S6** | 🏃 Node Mobility | Node เคลื่อนที่แบบ Dynamic | ✅ สำเร็จ — Seamless Handoff 37 ms |
| **S7** | 🔀 Multi-hop Routing | ส่งข้อมูลผ่านหลาย Node (Relay) | ✅ สำเร็จ — 65 ms ผ่าน 2 hops |

### Python Simulation Mockup (`simulation_mockup.py`)
สคริปต์ Python สำหรับจำลองสถาปัตยกรรม ONet ในรูปแบบ Toy Model ประกอบด้วย:
- **`OmnitrixNode`** — จำลอง Node ที่มี Local Cache และ Network Connection
- **`ONetNetwork`** — จำลอง PBFT Consensus ด้วย Plumber Nodes 3 ตัว

```bash
python simulation_mockup.py
```

---

## 📊 ผลลัพธ์การจำลอง

### Key Performance Metrics (ONet)

| Metric | ค่า |
|---|---|
| Avg Local Latency (Tier 1) | **3.2 ms** |
| Cache Hit Ratio | **94.3%** |
| Packet Delivery (Normal) | **99.7%** |
| Avg Consensus Latency (Tier 2) | **247 ms** |

### ONet vs TCP/IP — สรุปเปรียบเทียบ

| มิติ | ONet (Bio-SCION) | TCP/IP |
|---|---|---|
| **Average Latency** | 3.2 — 247 ms | 375 ms |
| **Network Partition** | 50% ยังใช้งานได้ (cached) | 0% — ล้มเหลว 100% |
| **In-Network Caching** | 94.3% Cache Hit | ไม่มี — ต้องดึงจาก Server ทุกครั้ง |
| **Node Mobility** | Seamless Handoff (37 ms) | Re-establish (~2000 ms) |
| **Security** | Data-Level Signing + PBFT | Channel-Level Only (TLS) |
| **Access Control** | Decentralized PBFT (no SPOF) | Centralized Server (SPOF) |

---

## 🚀 วิธีการใช้งาน

### เปิดเว็บไซต์
ไม่ต้องติดตั้งอะไรเพิ่มเติม เปิดด้วย Browser ได้เลย:

```bash
# เปิดไฟล์ index.html ด้วย Browser
# หรือใช้ Live Server ใน VS Code
```

### รัน Python Simulation

```bash
cd pronetwork2/pronetwork
python simulation_mockup.py
```

---

## 📅 แผนการดำเนินงาน

| สัปดาห์ | หัวข้อ | เป้าหมาย |
|---|---|---|
| **Week 1** | Environment Setup & Baseline | ติดตั้ง ns-3, ndnSIM + สร้าง Mesh Topology + TCP/IP Baseline |
| **Week 2** | Protocol Implementation | สร้าง State Capsule + In-Network Caching + Transformation Script |
| **Week 3** | Edge Cases & Security | Network Partition Test + PBFT Consensus Simulation |
| **Week 4** | Analysis & Presentation | สร้างกราฟ Metrics + รายงานฉบับสมบูรณ์ + วิดีโอนำเสนอ |

---

## 👥 สมาชิกกลุ่มและหน้าที่

| ชื่อ-นามสกุล | ตำแหน่ง | หน้าที่รับผิดชอบ |
|---|---|---|
| **นายเกียรติศักดิ์ นันทรัตน์ (Kiattisak Nantarat)** | Project Manager & System Architect | ดูแลการรวมระบบสถาปัตยกรรมทั้งหมด, จัดการ GitHub Repository, ตรวจสอบและสรุป Architecture Spec |
| **นายศุภวัฒน์ ไคทอง (Supawat Kaitong)** | NDN Protocol Specialist | ตั้งค่าสภาพแวดล้อม ndnSIM, กำหนดรูปแบบการตั้งชื่อ (`/ONet/DNA/...`), สร้างโครงสร้าง State Capsule Packet |
| **นายภาคิน เมฆสุวรรณ (Pakin Meksuwan)** | Security & Consensus Engineer | ออกแบบตรรกะการจำลองระบบรักษาความปลอดภัยแบบ Capability-Based และระบบ PBFT Consensus สำหรับ Alien Species Preservation System |
| **นายนครินทร์ ณ ระนอง (Nakarin Na Ranong)** | ns-3 Simulation Engineer | สร้าง Federated Mesh Topology ด้วย C++/Python, ตั้งค่า Node Mobility Model และคุณสมบัติ Link (Bandwidth, Delay) |
| **นายสรวิชญ์ วันเซ็น (Sorawit Wansen)** | ns-3 Simulation Engineer | เขียนสคริปต์สถานการณ์ทดสอบ (Network Partition, Node Failure), พัฒนาระบบเก็บข้อมูล Latency และ Packet Loss |

---

## 📝 License

โปรเจกต์นี้เป็นส่วนหนึ่งของรายวิชา **Computer Networks (CP352005)** — กลุ่มที่ 3

© 2026 ONet — Omnitrix Communication Network | Group 3
