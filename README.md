# CSE327-Project
ForgePC
## Group Members
- Mahir Ahmed (2232069642)
- Hasibul Kabir (2311665042)
- Ahmed Ishmam Arefin (2322035642)
- Nurul Wahab (2411377042)

# ForgePC  
### The Autonomous Computational Architect

## Overview
**ForgePC** is an intelligent system designed to simplify and optimize PC building. It ensures full compatibility between components while aligning recommendations with real-time market availability.

The goal is to provide a reliable "life solution" for professionals and gamers who need high-performance systems without the risks of incompatibility, bottlenecks, or unavailable parts.

---

## Vision
To master the complexity of PC architecture by delivering:
- Complete component synergy  
- Real-time inventory validation  
- Performance-focused build recommendations  

---

## Core Functionality

ForgePC operates using an **agent-based ReAct framework**:

### 1. Reasoning
The system evaluates hardware compatibility and performance constraints, including:
- Thermal Design Power (TDP)
- VRM thermals
- Physical clearance (case, GPU length, cooler height)
- Power requirements and PSU headroom

This ensures builds are physically compatible and thermally stable.

---

### 2. Action
ForgePC integrates with local retailers to:
- Monitor real-time stock availability  
- Track pricing changes  
- Ensure all recommended parts are currently purchasable  

**Supported vendors:**
- Star Tech  
- Ryans  
- Computer Mania  

---

### 3. Iteration
If a component becomes unavailable:
- The system dynamically replaces it with a suitable alternative  
- Re-evaluates the entire build for compatibility and performance  
- Maintains the user’s target performance level  

---

## Key Features

### Synergy Verification
- Validates compatibility across all components:
  - CPU ↔ Motherboard (socket, chipset)
  - GPU ↔ Case clearance
  - PSU wattage and efficiency margins
  - RAM compatibility and speeds

---

### Multi-Vendor Aggregation
- Combines products from multiple retailers  
- Generates a unified "shopping cart"  
- Optimizes for cost-effectiveness and availability  

---

## Use Cases
- Gamers building high-performance rigs  
- Professionals requiring stable workstations  
- Users who want a hassle-free, fully compatible PC build  

---

## Future Improvements
- Automated price optimization  
- Regional vendor expansion  
- AI-driven performance benchmarking  
- User preference learning  
