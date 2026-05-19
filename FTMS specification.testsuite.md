```
Bluetooth SIG Proprietary
```
Bluetooth® Test Suite

```
▪ Revision: FTMS.TS.p
▪ Revision Date: 2024 - 10 - 08
▪ Prepared By: Sports and Fitness Working Group
▪ Published during TCRL: TCRL.202 4 - 2 - addition
```
# Fitness Machine Service

# (FTMS)


This document, regardless of its title or content, is not a Bluetooth Specification as defined in the Bluetooth
**Patent/Copyright License Agreement (“PCLA”) and Bluetooth Trademark License Agreement. Use of this document by**
members of Bluetooth SIG is governed by the membership and other related agreements between Bluetooth SIG Inc.
**(“Bluetooth SIG”) and its members, including the PCLA and other agreements posted on Bluetooth SIG’s website located**
at [http://www.bluetooth.com.](http://www.bluetooth.com.)

**THIS DOCUMENT IS PROVIDED “AS IS” AND BLUETOOTH SIG, ITS MEMBERS, AND THEIR AFFILIATES MAKE NO**
REPRESENTATIONS OR WARRANTIES AND DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING ANY
WARRANTY OF MERCHANTABILITY, TITLE, NON-INFRINGEMENT, FITNESS FOR ANY PARTICULAR PURPOSE, THAT
THE CONTENT OF THIS DOCUMENT IS FREE OF ERRORS.

TO THE EXTENT NOT PROHIBITED BY LAW, BLUETOOTH SIG, ITS MEMBERS, AND THEIR AFFILIATES DISCLAIM ALL
LIABILITY ARISING OUT OF OR RELATING TO USE OF THIS DOCUMENT AND ANY INFORMATION CONTAINED IN THIS
DOCUMENT, INCLUDING LOST REVENUE, PROFITS, DATA OR PROGRAMS, OR BUSINESS INTERRUPTION, OR FOR
SPECIAL, INDIRECT, CONSEQUENTIAL, INCIDENTAL OR PUNITIVE DAMAGES, HOWEVER CAUSED AND REGARDLESS
OF THE THEORY OF LIABILITY, AND EVEN IF BLUETOOTH SIG, ITS MEMBERS, OR THEIR AFFILIATES HAVE BEEN
ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.

This document is proprietary to Bluetooth SIG. This document may contain or cover subject matter that is intellectual
property of Bluetooth SIG and its members. The furnishing of this document does not grant any license to any intellectual
property of Bluetooth SIG or its members.

This document is subject to change without notice.

Copyright © 2016 **–** 2024 by Bluetooth SIG, Inc. The Bluetooth word mark and logos are owned by Bluetooth SIG, Inc. Other
third-party brands and names are the property of their respective owners.


## Contents





- 1 Scope
- 2 References, definitions, and abbreviations
   - 2.1 References
   - 2.2 Definitions
   - 2.3 Acronyms and abbreviations
- 3 Test Suite Structure (TSS)
   - 3.1 Overview
   - 3.2 Test Strategy
   - 3.3 Test groups
- 4 Test cases (TC)
   - 4.1 Introduction
   - 4.1.1 Test case identification conventions
   - 4.1.2 Conformance
   - 4.1.3 Pass/Fail verdict conventions
   - 4.2 Setup preambles
   - 4.2.1 ATT Bearer on LE Transport
   - 4.2.2 ATT Bearer on BR/EDR Transport........................................................................................................
   - 4.2.3 Fitness Machine Control Point
   - 4.3 Generic GATT Integrated Tests
   - FTMS/SR/SGGIT/SER/BV- 01 - C [Service GGIT – Fitness Machine]
   - FTMS/SR/SGGIT/SDP/BV- 01 - C [SDP Record]
   - FTMS/SR/SGGIT/CHA/BV- 01 - C [Characteristic GGIT – Fitness Machine Feature]
   - FTMS/SR/SGGIT/CHA/BV- 02 - C [Characteristic GGIT – Treadmill Data]
   - FTMS/SR/SGGIT/CHA/BV- 03 - C [Characteristic GGIT – Cross Trainer Data]
   - FTMS/SR/SGGIT/CHA/BV- 04 - C [Characteristic GGIT – Step Climber Data]
   - FTMS/SR/SGGIT/CHA/BV- 05 - C [Characteristic GGIT – Stair Climber Data]
   - FTMS/SR/SGGIT/CHA/BV- 06 - C [Characteristic GGIT – Rower Data]
   - FTMS/SR/SGGIT/CHA/BV- 07 - C [Characteristic GGIT – Indoor Bike Data]
   - FTMS/SR/SGGIT/CHA/BV- 08 - C [Characteristic GGIT – Training Status Data]
   - FTMS/SR/SGGIT/CHA/BV- 09 - C [Characteristic GGIT – Supported Speed Range]
   - FTMS/SR/SGGIT/CHA/BV- 10 - C [Characteristic GGIT – Supported Inclination Range]
   - FTMS/SR/SGGIT/CHA/BV- 11 - C [Characteristic GGIT – Supported Resistance Level Range]
   - FTMS/SR/SGGIT/CHA/BV- 12 - C [Characteristic GGIT – Supported Power Range]
   - FTMS/SR/SGGIT/CHA/BV- 13 - C [Characteristic GGIT – Supported Heart Rate Range]
   - FTMS/SR/SGGIT/CHA/BV- 14 - C [Characteristic GGIT – Fitness Machine Control Point]
   - FTMS/SR/SGGIT/CHA/BV- 15 - C [Characteristic GGIT – Fitness Machine Status]
   - FTMS/SR/SGGIT/CHA/BV- 16 - C [Characteristic GGIT – Fitness Machine Feature – Indicate]
   - 4.3.1 Generic GATT Indication Supported Features Characteristic
   - FTMS/SR/SGGIT/ISFC/BV- 01 - C [Characteristic GGIT – Fitness Machine Feature Indication]
   - 4.4 Characteristic Read
   - FTMS/SR/CR/BV- 01 - C [Characteristic Read – Fitness Machine Feature]
   - 4.4.1 Characteristic Reads – Generic Procedure
   - FTMS/SR/CR/BV- 02 - C [Characteristic Read – Training Status]
   - FTMS/SR/CR/BV- 03 - C [Characteristic Read – Supported Speed Range]
   - FTMS/SR/CR/BV- 04 - C [Characteristic Read – Supported Inclination Range]
   - FTMS/SR/CR/BV- 05 - C [Characteristic Read – Supported Resistance Level Range]
   - FTMS/SR/CR/BV- 06 - C [Characteristic Read – Supported Power Range]
   - FTMS/SR/CR/BV- 07 - C [Characteristic Read – Supported Heart Rate Range]
- 4.5 Configure Indication and Notification
- FTMS/SR/CON/BV- 01 - C [Configure Notification – Treadmill Data]
- FTMS/SR/CON/BV- 02 - C [Configure Notification – Cross trainer Data]
- FTMS/SR/CON/BV- 03 - C [Configure Notification – Step Climber Data]
- FTMS/SR/CON/BV- 04 - C [Configure Notification – Stair Climber]
- FTMS/SR/CON/BV- 05 - C [Configure Notification – Rower Data]
- FTMS/SR/CON/BV- 06 - C [Configure Notification – Indoor Bike Data]
- FTMS/SR/CON/BV- 07 - C [Configure Notification – Training Status]
- FTMS/SR/CON/BV- 08 - C [Configure Indication – Fitness Machine Control Point]
- FTMS/SR/CON/BV- 09 - C [Configure Notification – Fitness Machine Status]
- 4.6 Characteristic Notification
- FTMS/SR/CN/BV- 01 - C [Treadmill Data Notifications – Receive Complete Data Record]
- 4.6.1 Treadmill Data Notifications – Supported Fields
- FTMS/SR/CN/BV- 02 - C [Treadmill Data Notifications – Average Speed Supported]
- FTMS/SR/CN/BV- 03 - C [Treadmill Data Notifications – Total Distance Supported]
- FTMS/SR/CN/BV- 04 - C [Treadmill Data Notifications – Inclination Supported]
- FTMS/SR/CN/BV- 05 - C [Treadmill Data Notifications – Elevation Gain Supported]
- FTMS/SR/CN/BV- 06 - C [Treadmill Data Notifications – Pace Supported]
- FTMS/SR/CN/BV- 07 - C [Treadmill Data Notifications – Expended Energy Supported]
- FTMS/SR/CN/BV- 08 - C [Treadmill Data Notifications – Heart Rate Measurement Supported]
- FTMS/SR/CN/BV- 09 - C [Treadmill Data Notifications – Metabolic Equivalent Supported]
- FTMS/SR/CN/BV- 10 - C [Treadmill Data Notifications – Remaining Time Supported]
- FTMS/SR/CN/BV- 11 - C [Treadmill Data Notifications – Force On Belt and Power Output Supported]
- FTMS/SR/CN/BV- 12 - C [Treadmill Data Notifications – Elapsed Time]
- FTMS/SR/CN/BV- 13 - C [Cross Trainer Data Notifications – Receive Complete Data Record]..............................
- 4.6.2 Cross Trainer Data Notifications – Supported Fields
- FTMS/SR/CN/BV- 14 - C [Cross Trainer Data Notifications – Average Speed Supported]
- FTMS/SR/CN/BV- 15 - C [Cross Trainer Data Notifications – Total Distance Supported]
- FTMS/SR/CN/BV- 16 - C [Cross Trainer Data Notifications – Step Count Supported]
- FTMS/SR/CN/BV- 17 - C [Cross Trainer Data Notifications – Stride Count Supported]
- FTMS/SR/CN/BV- 18 - C [Cross Trainer Data Notifications – Elevation Gain Supported]
- FTMS/SR/CN/BV- 19 - C [Cross Trainer Data Notifications – Inclination Supported]
- FTMS/SR/CN/BV- 20 - C [Cross Trainer Data Notifications – Resistance Level Supported]
- FTMS/SR/CN/BV- 21 - C [Cross Trainer Data Notifications – Power Measurement Supported]
- FTMS/SR/CN/BV- 22 - C [Cross Trainer Data Notifications – Expended Energy Supported]
- FTMS/SR/CN/BV- 23 - C [Cross Trainer Data Notifications – Heart Rate Measurement Supported]
- FTMS/SR/CN/BV- 24 - C [Cross Trainer Data Notifications – Metabolic Equivalent Supported]
- FTMS/SR/CN/BV- 26 - C [Cross Trainer Data Notifications – Remaining Time Supported]
- FTMS/SR/CN/BV- 25 - C [Cross Trainer Data Notifications – Elapsed Time]
- FTMS/SR/CN/BV- 27 - C [Step Climber Data Notifications – Receive Complete Data Record]
- 4.6.3 Step Climber Data Notifications – Supported Fields
- FTMS/SR/CN/BV- 28 - C [Step Climber Data Notifications – Step Count Supported]
- FTMS/SR/CN/BV- 29 - C [Step Climber Data Notifications – Elevation Gain Supported]
- FTMS/SR/CN/BV- 30 - C [Step Climber Data Notifications – Expended Energy Supported]
- FTMS/SR/CN/BV- 31 - C [Step Climber Data Notifications – Heart Rate Measurement Supported]
- FTMS/SR/CN/BV- 32 - C [Step Climber Data Notifications – Metabolic Equivalent Supported]
- FTMS/SR/CN/BV- 34 - C [Step Climber Data Notifications – Remaining Time Supported]
- FTMS/SR/CN/BV- 33 - C [Step Climber Data Notifications – Elapsed Time]
- FTMS/SR/CN/BV- 35 - C [Stair Climber Data Notifications – Receive Complete Data Record]
- 4.6.4 Stair Climber Data Notifications – Supported Fields
- FTMS/SR/CN/BV- 36 - C [Stair Climber Data Notifications – Step Count Supported]
- FTMS/SR/CN/BV- 37 - C [Stair Climber Data Notifications – Elevation Gain Supported]
- FTMS/SR/CN/BV- 38 - C [Stair Climber Data Notifications – Stride Count Supported]
- FTMS/SR/CN/BV- 39 - C [Stair Climber Data Notifications – Expended Energy Supported]
- FTMS/SR/CN/BV- 40 - C [Stair Climber Data Notifications – Heart Rate Measurement Supported]
- FTMS/SR/CN/BV- 41 - C [Stair Climber Data Notifications – Metabolic Equivalent Supported]
- FTMS/SR/CN/BV- 43 - C [Stair Climber Data Notifications – Remaining Time Supported]
- FTMS/SR/CN/BV- 42 - C [Stair Climber Data Notifications – Elapsed Time]
- FTMS/SR/CN/BV- 44 - C [Rower Data Notifications – Receive Complete Data Record]
- 4.6.5 Rower Data Notifications – Supported Fields
- FTMS/SR/CN/BV- 45 - C [Rower Data Notifications – Average Stroke Rate Supported]
- FTMS/SR/CN/BV- 46 - C [Rower Data Notifications – Total Distance Supported]
- FTMS/SR/CN/BV- 47 - C [Rower Data Notifications – Pace Supported]
- FTMS/SR/CN/BV- 48 - C [Rower Data Notifications – Instantaneous Power Supported]
- FTMS/SR/CN/BV- 49 - C [Rower Data Notifications – Resistance Level Supported]
- FTMS/SR/CN/BV- 50 - C [Rower Data Notifications – Expended Energy Supported]
- FTMS/SR/CN/BV- 51 - C [Rower Data Notifications – Heart Rate Measurement Supported]
- FTMS/SR/CN/BV- 52 - C [Rower Data Notifications – Metabolic Equivalent Supported]
- FTMS/SR/CN/BV- 53 - C [Rower Data Notifications – Remaining Time Supported]
- FTMS/SR/CN/BV- 54 - C [Rower Data Notifications – Elapsed Time]
- FTMS/SR/CN/BV- 55 - C [Indoor Bike Data Notifications – Receive Complete Data Record]
- 4.6.6 Indoor Bike Data Notifications – Supported Fields
- FTMS/SR/CN/BV- 56 - C [Indoor Bike Data Notifications – Average Speed Supported]
- FTMS/SR/CN/BV- 57 - C [Indoor Bike Data Notifications – Cadence Supported]
- FTMS/SR/CN/BV- 58 - C [Indoor Bike Data Notifications – Total Distance Supported]
- FTMS/SR/CN/BV- 59 - C [Indoor Bike Data Notifications – Resistance Level Supported]
- FTMS/SR/CN/BV- 60 - C [Indoor Bike Data Notifications – Power Measurement Supported]
- FTMS/SR/CN/BV- 61 - C [Indoor Bike Data Notifications – Expended Energy Supported]
- FTMS/SR/CN/BV- 62 - C [Indoor Bike Data Notifications – Heart Rate Measurement Supported]
- FTMS/SR/CN/BV- 63 - C [Indoor Bike Data Notifications – Metabolic Equivalent Supported]
- FTMS/SR/CN/BV- 64 - C [Indoor Bike Data Notifications – Remaining Time Supported]
- FTMS/SR/CN/BV- 65 - C [Indoor Bike Data Notifications – Elapsed Time]
- 4.7 Training Status Notifications
- FTMS/SR/TSN/BV- 01 - C [Training Status Notifications]
- FTMS/SR/TSN/BV- 02 - C [Training Status Notifications – Training Status String]
- FTMS/SR/TSN/BV- 03 - C [Training Status Notifications – Training Status Extended String]
- 4.8 Fitness Machine Status Notifications
- FTMS/SR/FMSN/BV- 01 - C [Fitness Machine Status Notifications - Reset]
- FTMS/SR/FMSN/BV- 02 - C [Fitness Machine Status Notifications – Fitness Machine Stopped by the User]
- FTMS/SR/FMSN/BV- 03 - C [Fitness Machine Status Notifications – Fitness Machine Paused by the User]
- Key] FTMS/SR/FMSN/BV- 04 - C [Fitness Machine Status Notifications – Fitness Machine Stopped by the Safety
- the User] FTMS/SR/FMSN/BV- 05 - C [Fitness Machine Status Notifications – Fitness Machine Started or Resumed by
- FTMS/SR/FMSN/BV- 06 - C [Fitness Machine Status Notifications – Target Speed Changed]
- FTMS/SR/FMSN/BV- 07 - C [Fitness Machine Status Notifications – Target Incline Changed]
- UINT8] FTMS/SR/FMSN/BV- 08 - C [Fitness Machine Status Notifications – Target Resistance Level Changed –
- SINT16] FTMS/SR/FMSN/BV- 25 - C [Fitness Machine Status Notifications – Target Resistance Level Changed –
- FTMS/SR/FMSN/BV- 09 - C [Fitness Machine Status Notifications – Target Power Changed]
- FTMS/SR/FMSN/BV- 10 - C [Fitness Machine Status Notifications – Target Heart Rate Changed]
- FTMS/SR/FMSN/BV- 11 - C [Fitness Machine Status Notifications – Targeted Expended Energy Changed]
- FTMS/SR/FMSN/BV- 12 - C [Fitness Machine Status Notifications – Targeted Number of Steps Changed]
- FTMS/SR/FMSN/BV- 13 - C [Fitness Machine Status Notifications – Targeted Number of Strides Changed]
- FTMS/SR/FMSN/BV- 14 - C [Fitness Machine Status Notifications – Targeted Distance Changed]
- FTMS/SR/FMSN/BV- 15 - C [Fitness Machine Status Notifications – Targeted Training Time Changed]
- Rate Zones Changed] FTMS/SR/FMSN/BV- 16 - C [Fitness Machine Status Notifications – Targeted Training Time in Two Heart
- Rate Zones Changed] FTMS/SR/FMSN/BV- 17 - C [Fitness Machine Status Notifications – Targeted Training Time in Three Heart
- Rate Zones Changed] FTMS/SR/FMSN/BV- 18 - C [Fitness Machine Status Notifications – Targeted Training Time in Five Heart
- Changed] FTMS/SR/FMSN/BV- 19 - C [Fitness Machine Status Notifications – Indoor Bike Simulation Parameters
- FTMS/SR/FMSN/BV- 20 - C [Fitness Machine Status Notifications – Wheel Circumference Changed]
- FTMS/SR/FMSN/BV- 21 - C [Fitness Machine Status Notifications – Spin Down Status - Request]
- Request]................................................................................................................................................................ FTMS/SR/FMSN/BV- 22 - C [Fitness Machine Status Notifications – Targeted Cadence Changed Status -
- FTMS/SR/FMSN/BV- 23 - C [Fitness Machine Status Notifications – Control Permission Lost]
- FTMS/SR/FMSN/BV- 24 - C [Fitness Machine Status Notifications – Multiple Clients]
- 4.9 Characteristic Write.....................................................................................................................
- FTMS/SR/CW/BV- 01 - C [Fitness Machine Control Point – Request Control Procedure]
- 4.9.1 Fitness Machine Control Point Procedures
- FTMS/SR/CW/BV- 02 - C [Fitness Machine Control Point – Reset Procedure]
- FTMS/SR/CW/BV- 03 - C [Fitness Machine Control Point – Set Target Speed Procedure]
- FTMS/SR/CW/BV- 04 - C [Fitness Machine Control Point – Set Target Inclination Procedure]
- FTMS/SR/CW/BV- 05 - C [Fitness Machine Control Point – Set Target Resistance Level Procedure]
- FTMS/SR/CW/BV- 06 - C [Fitness Machine Control Point – Set Target Power Procedure]
- FTMS/SR/CW/BV- 07 - C [Fitness Machine Control Point – Set Target Heart Rate Procedure]
- FTMS/SR/CW/BV- 08 - C [Fitness Machine Control Point – Start or Resume Procedure]
- FTMS/SR/CW/BV- 09 - C [Fitness Machine Control Point – Stop Procedure]
- FTMS/SR/CW/BV- 10 - C [Fitness Machine Control Point – Pause Procedure]
- FTMS/SR/CW/BV- 11 - C [Fitness Machine Control Point – Set Targeted Expended Energy Procedure]
- FTMS/SR/CW/BV- 12 - C [Fitness Machine Control Point – Set Targeted Number of Steps Procedure]
- FTMS/SR/CW/BV- 13 - C [Fitness Machine Control Point – Set Targeted Number of Strides Procedure]
- FTMS/SR/CW/BV- 14 - C [Fitness Machine Control Point – Set Targeted Distance Procedure]
- FTMS/SR/CW/BV- 15 - C [Fitness Machine Control Point – Set Targeted Training Time Procedure]
- Procedure] FTMS/SR/CW/BV- 16 - C [Fitness Machine Control Point – Set Targeted Time in Two Heart Rate Zones
- Procedure] FTMS/SR/CW/BV- 17 - C [Fitness Machine Control Point – Set Targeted Time in Three Heart Rate Zones
- Procedure] FTMS/SR/CW/BV- 18 - C [Fitness Machine Control Point – Set Targeted Time in Five Heart Rate Zones
- FTMS/SR/CW/BV- 19 - C [Fitness Machine Control Point – Set Indoor Bike Simulation Parameters Procedure]
- FTMS/SR/CW/BV- 20 - C [Fitness Machine Control Point – Set Wheel Circumference Procedure]
- FTMS/SR/CW/BV- 21 - C [Fitness Machine Control Point – Spin Down Control Procedure]
- FTMS/SR/CW/BV- 22 - C [Fitness Machine Control Point – Set Targeted Cadence]
- 4.10 Service Procedure – Error Handling
- FTMS/SR/SPE/BV- 01 - C [Fitness Machine Control Point – Invalid Start or Resume Procedure]
- FTMS/SR/SPE/BV- 02 - C [Fitness Machine Control Point – Invalid Stop or Pause Procedure]
- FTMS/SR/SPE/BV- 03 - C [Fitness Machine Control Point – Unsupported Op Code]
- Procedure] FTMS/SR/SPE/BV- 04 - C [Fitness Machine Control Point – Out of Range Parameter Set Target Speed
- Procedure] FTMS/SR/SPE/BI- 05 - C [Fitness Machine Control Point – Out of Range Parameter Set Target Inclination
- Level Procedure] FTMS/SR/SPE/BI- 06 - C [Fitness Machine Control Point – Out of Range Parameter Set Target Resistance
- Procedure] FTMS/SR/SPE/BI- 07 - C [Fitness Machine Control Point – Out of Range Parameter Set Target Power
- Procedure] FTMS/SR/SPE/BI- 08 - C [Fitness Machine Control Point – Out of Range Parameter Set Target Heart Rate
- FTMS/SR/SPE/BV- 09 - C [Fitness Machine Control Point – Control Not Permitted]
- 5 Test case mapping
- 6 Revision history and acknowledgments


## 1 Scope

This Bluetooth document contains the Test Suite Structure (TSS) and test cases to test the
implementation of the Bluetooth Fitness Machine Service Specification with the objective to provide a

high probability of air interface interoperability between the tested implementation and other
manufacturers’ Bluetooth devices.


## 2 References, definitions, and abbreviations

### 2.1 References

This document incorporates provisions from other publications by dated or undated reference. These

references are cited at the appropriate places in the text, and the publications are listed hereinafter.
Additional definitions and abbreviations can be found in [1] and [2].

[1] Bluetooth Core Specification, Version 4.0 or later

[2] Test Strategy and Terminology Overview

[3] Fitness Machine Profile Specification, Version 1.0 or later

[4] Fitness Machine Service Specification, Version 1.0 or later

[5] Fitness Machine Service ICS, FTMS.ICS

[6] GATT Test Suite, GATT.TS

[7] Characteristic and Descriptor descriptions are accessible via the Bluetooth SIG Assigned Numbers

[8] Fitness Machine Service Implementation eXtra Information for Test, FTMS.IXIT

[9] Bluetooth Core Specification Supplement (CSS), Version 7

[10] Fitness Machine Characteristics, Version 1.

[11] Fitness Machine Service Specification, Version 1.0.

### 2.2 Definitions

In this Bluetooth document, the definitions from [1] and [2] apply.

### 2.3 Acronyms and abbreviations

In this Bluetooth document, the definitions, acronyms, and abbreviations from [1] and [2] apply.


## 3 Test Suite Structure (TSS)

### 3.1 Overview

The Fitness Machine Service requires the presence of GAP, SM, and GATT. This is illustrated in

Figure 3. 1.

```
Fitness Machine Service
GATT
ATT GAP SM
(LE)
```
#### SDP

#### (BR/EDR)

#### L2CAP

```
Controller
```
Figure 3. 1 : Fitness Machine Service test model

### 3.2 Test Strategy

The test objectives are to verify the functionality of the Fitness Machine Service within a Bluetooth Host
and enable interoperability between Bluetooth Hosts on different devices. The testing approach covers

mandatory and optional requirements in the specification and matches these to the support of the IUT as
described in the ICS. Any defined test herein is applicable to the IUT if the ICS logical expression defined
in the Test Case Mapping Table (TCMT) evaluates to true.

The test equipment provides an implementation of the Radio Controller and the parts of the Host needed

to perform the test cases defined in this Test Suite. A Lower Tester acts as the IUT’s peer device and
interacts with the IUT over-the-air interface. The configuration, including the IUT, needs to implement
similar capabilities to communicate with the test equipment. For some test cases, it is necessary to
stimulate the IUT from an Upper Tester. In practice, this could be implemented as a special test interface,

a Man Machine Interface (MMI), or another interface supported by the IUT.

This Test Suite contains Valid Behavior (BV) tests complemented with Invalid Behavior (BI) tests where
required. The test coverage mirrored in the Test Suite Structure is the result of a process that started with
cataloged specification requirements that were logically grouped and assessed for testability enabling
coverage in defined test purposes.

The interface between the IUT and the Upper Tester may be:

- An MMI
- Provided by the IUT manufacturer

### 3.3 Test groups

The following test groups have been defined:

- Generic GATT Integrated Tests
- Service Data AD Type
- Characteristic Read
- Characteristic Read Long
- Characteristic Write
- Configure Notification


- Configure Indication
- Characteristic Notification
- Training Status Notification
- Fitness Machine Status Notification
- Service Procedure – Error Handling


## 4 Test cases (TC)

### 4.1 Introduction

### 4.1.1 Test case identification conventions

Test cases are assigned unique identifiers per the conventions in [2]. The convention used here is:
<spec abbreviation>/<IUT role>/<class>/<feat>/<func>/<subfunc>/<cap>/<xx>-<nn>-<y>.

Additionally, testing of this specification includes tests from the GATT Test Suite [6] referred to as Generic

GATT Integrated Tests (GGIT); when used, the test cases in GGIT are referred to through a TCID string
using the following convention:
<spec abbreviation>/<IUT role>/<GGIT test group>/< GGIT class >/<xx>-<nn>-<y>.

```
Identifier Abbreviation Spec Abbreviation Identifier <spec abbreviation>
FTMS Fitness Machine Service
Identifier Abbreviation IUT role Identifier <IUT role>
SR Fitness Machine Server
Identifier Abbreviation Reference Identifier <GGIT test group>
SGGIT Server Generic GATT Integrated Tests
Identifier Abbreviation Reference Identifier <GGIT class>
CHA Characteristic
ISFC Indication Supported Features Characteristic
SDP Validate SDP Record
SER Service
Identifier Abbreviation Feature Identifier <feat>
CN Characteristic Notification
CON Configure Indication or Notification
CR Characteristic Read
CW Characteristic Write
FMSN Fitness Machine Status Notification
SPE Service Procedure – Error Handling
TSN Training Status Notification
```
Table 4. 1 : FTMS TC feature naming conventions

### 4.1.2 Conformance

When conformance is claimed for a particular specification, all capabilities are to be supported in the
specified manner. The mandated tests from this Test Suite depend on the capabilities to which

conformance is claimed.

The Bluetooth Qualification Program may employ tests to verify implementation robustness. The level of
implementation robustness that is verified varies from one specification to another and may be revised for
cause based on interoperability issues found in the market.


Such tests may verify:

- That claimed capabilities may be used in any order and any number of repetitions not excluded by the
    specification
- That capabilities enabled by the implementations are sustained over durations expected by the use
    case
- That the implementation gracefully handles any quantity of data expected by the use case
- That in cases where more than one valid interpretation of the specification exists, the implementation
    complies with at least one interpretation and gracefully handles other interpretations
- That the implementation is immune to attempted security exploits

A single execution of each of the required tests is required to constitute a Pass verdict. However, it is

noted that to provide a foundation for interoperability, it is necessary that a qualified implementation
consistently and repeatedly pass any of the applicable tests.

In any case, where a member finds an issue with the test plan generated by the Bluetooth SIG
qualification tool, with the test case as described in the Test Suite, or with the test system utilized, the

member is required to notify the responsible party via an erratum request such that the issue may be
addressed.

### 4.1.3 Pass/Fail verdict conventions

Each test case has an Expected Outcome section. The IUT is granted the Pass verdict when all the
detailed pass criteria conditions within the Expected Outcome section are met.

The convention in this Test Suite is that, unless there is a specific set of fail conditions outlined in the test
case, the IUT fails the test case as soon as one of the pass criteria conditions cannot be met. If this

occurs, the outcome of the test is a Fail verdict.

### 4.2 Setup preambles

The procedures defined in this section are provided as information, as they are used by test equipment in
achieving the initial conditions in certain tests.

### 4.2.1 ATT Bearer on LE Transport

- Preamble Procedure
    1. Establish an LE transport connection between the IUT and the Lower Tester.
    2. Establish an L2CAP channel 0x0004 between the IUT and the Lower Tester over that LE
       transport.

### 4.2.2 ATT Bearer on BR/EDR Transport........................................................................................................

- Preamble Procedure
    1. Establish a BR/EDR transport connection between the IUT and the Lower Tester.
    2. Establish several L2CAP channels (PSM 0x001F) between the IUT and the Lower Tester over
       that BR/EDR transport.

### 4.2.3 Fitness Machine Control Point

- Preamble Purpose

```
Follow this preamble procedure to enable the IUT for use with the Fitness Machine Control Point.
```

- Preamble Procedure
    1. Establish an ATT Bearer connection between the Lower Tester and IUT as described in
       Section 4.2.1, if using an LE transport, or Section 4.2.2 if using a BR/EDR transport.
    2. The handle of the Fitness Machine Control Point characteristic has been previously discovered by
       the Lower Tester during a test procedure in Section 4.3 or is known to the Lower Tester by other
       means.
    3. The handle of the Client Configuration descriptor of the Fitness Machine Control Point
       Characteristic has been previously discovered by the Lower Tester during a test procedure in
       Section 4.3 or is known to the Lower Tester by other means.
    4. If the IUT requires bonding, then the Lower Tester performs a bonding procedure.
    5. The IUT configures the Fitness Machine Control Point characteristic for indications, and if the test
       case requires notifications, then the IUT configures these characteristics for notifications. Those
       configurations may happen in any order.


### 4.3 Generic GATT Integrated Tests

Execute the Generic GATT Integrated Tests defined in Section 6.3, Server test procedures (SGGIT), in [6] using Table 4. 2 below as input:

```
TCID Service / Characteristic /
Descriptor
```
```
Reference Properties Value
Length
(Octets)
```
```
Service Type
```
### FTMS/SR/SGGIT/SER/BV- 01 - C [Service GGIT – Fitness Machine]

```
Fitness Machine Service [4] 2 - - Primary or
Secondary Service
```
### FTMS/SR/SGGIT/SDP/BV- 01 - C [SDP Record]

### FTMS/SR/SGGIT/CHA/BV- 01 - C [Characteristic GGIT – Fitness Machine Feature]

```
Fitness Machine Feature
Characteristic
```
```
[4] 4.3 0x02 (Read) Skip -
```
### FTMS/SR/SGGIT/CHA/BV- 02 - C [Characteristic GGIT – Treadmill Data]

```
Treadmill Data
Characteristic
```
```
[4] 4.4 0x10 (Notify) Skip -
```
### FTMS/SR/SGGIT/CHA/BV- 03 - C [Characteristic GGIT – Cross Trainer Data]

```
Cross Trainer Data
Characteristic
```
```
[4] 4.5 0x10 (Notify) Skip -
```
### FTMS/SR/SGGIT/CHA/BV- 04 - C [Characteristic GGIT – Step Climber Data]

```
Step Climber Data
Characteristic
```
```
[4] 4.6 0x10 (Notify) Skip -
```
### FTMS/SR/SGGIT/CHA/BV- 05 - C [Characteristic GGIT – Stair Climber Data]

```
Stair Climber Data
Characteristic
```
```
[4] 4.7 0x10 (Notify) Skip -
```
### FTMS/SR/SGGIT/CHA/BV- 06 - C [Characteristic GGIT – Rower Data]

```
Rower Data Characteristic [4] 4.8 0x10 (Notify) Skip -
```
### FTMS/SR/SGGIT/CHA/BV- 07 - C [Characteristic GGIT – Indoor Bike Data]

```
Indoor Bike Data
Characteristic
```
```
[4] 4.9 0x10 (Notify) Skip -
```
### FTMS/SR/SGGIT/CHA/BV- 08 - C [Characteristic GGIT – Training Status Data]

```
Training Status
Characteristic
```
```
[4] 4.10 0x12 (Read,
Notify)
```
```
Skip -
```
### FTMS/SR/SGGIT/CHA/BV- 09 - C [Characteristic GGIT – Supported Speed Range]

```
Supported Speed Range
Characteristic
```
```
[4] 4.11 0x02 (Read) Skip -
```
### FTMS/SR/SGGIT/CHA/BV- 10 - C [Characteristic GGIT – Supported Inclination Range]

```
Supported Inclination
Range Characteristic
```
```
[4] 4.12 0x02 (Read) Skip -
```
### FTMS/SR/SGGIT/CHA/BV- 11 - C [Characteristic GGIT – Supported Resistance Level Range]

```
Supported Resistance
Level Range
Characteristic
```
```
[4] 4.13 0x02 (Read) Skip -
```

```
TCID Service / Characteristic /
Descriptor
```
```
Reference Properties Value
Length
(Octets)
```
```
Service Type
```
### FTMS/SR/SGGIT/CHA/BV- 12 - C [Characteristic GGIT – Supported Power Range]

```
Supported Power Range
Characteristic
```
```
[4] 4.14 0x02 (Read) Skip -
```
### FTMS/SR/SGGIT/CHA/BV- 13 - C [Characteristic GGIT – Supported Heart Rate Range]

```
Supported Heart Rate
Range Characteristic
```
```
[4] 4.15 0x02 (Read) Skip -
```
### FTMS/SR/SGGIT/CHA/BV- 14 - C [Characteristic GGIT – Fitness Machine Control Point]

```
Fitness Machine Control
Point Characteristic
```
```
[4] 4.16 0x28 (Write,
Indicate)
```
```
Skip -
```
### FTMS/SR/SGGIT/CHA/BV- 15 - C [Characteristic GGIT – Fitness Machine Status]

```
Fitness Machine Status
Characteristic
```
```
[4] 4.17 0x10 (Notify) Skip -
```
### FTMS/SR/SGGIT/CHA/BV- 16 - C [Characteristic GGIT – Fitness Machine Feature – Indicate]

```
Fitness Machine Feature
Characteristic
```
#### [11] 4,

#### 4.3.

```
0x22 (Read,
Indicate)
```
```
Skip -
```
Table 4. 2 : Input for the GGIT Server test procedure

### 4.3.1 Generic GATT Indication Supported Features Characteristic

Execute the Generic GATT Indication Supported Features Characteristic Tests defined in Section 6.3, Server test procedures (SGGIT), in [6] using
Table 4. 3 below as input:

```
TCID Characteristic Reference TC Configuration
```
### FTMS/SR/SGGIT/ISFC/BV- 01 - C [Characteristic GGIT – Fitness Machine Feature Indication]

```
Fitness Machine Feature
Characteristic
```
#### [11] 4.3.1 N/A

Table 4. 3 Input for the GGIT Indication Supported Features Characteristic tests


### 4.4 Characteristic Read

Read and verify that the characteristic values required by the service are compliant.

### FTMS/SR/CR/BV- 01 - C [Characteristic Read – Fitness Machine Feature]

- Test Purpose

```
Verify that the characteristic value meets the requirements of the service.
```
- Reference

```
[4] 4. 3 .1 and 4. 4.
```
- Initial Condition
    - The handle of the Fitness Machine Feature characteristic value referenced in the test has been
       previously discovered by the Lower Tester during the test procedure in Section 4.3 or is known to
       the Lower Tester by other means.
    - If the IUT requires a bonding procedure, then perform a bonding procedure.
    - Establish an ATT Bearer connection between the Lower Tester and IUT as described in
       Section 4.2.1, if using an LE transport, or Section 4.2.2 if using a BR/EDR transport.
    - If IUT permissions for the characteristic require a specific security mode or security level,
       establish a connection meeting those requirements.
- Test Procedure
    1. The Lower Tester sends an ATT_Read_Request to the IUT to read the characteristic value.
    2. The IUT sends an ATT_Read_Response to the Lower Tester.
    3. Verify that the characteristic value meets the requirements of the service.
- Expected Outcome

```
Pass verdict
```
```
The characteristic is successfully read, and the characteristic value is 8 octets with RFU bits set to 0.
([4] 4.3.1).
```
### 4.4.1 Characteristic Reads – Generic Procedure

- Test Purpose

```
Read and verify characteristic values supported by the Fitness Machine Service. The verification is
done one value at a time, as enumerated in the test cases in Table 4. 4 , using this generic test
procedure.
```
- Reference

```
[4] 4. 3 .1 and 4. 4.
```
- Initial Condition
    - The handle of each characteristic value referenced in the test cases below has been previously
       discovered by the Lower Tester during the test procedure in Section 4.3 or is known to the Lower
       Tester by other means.
    - If the IUT requires a bonding procedure, then perform a bonding procedure.


- Establish an ATT Bearer connection between the Lower Tester and IUT as described in
    Section 4.2.1, if using an LE transport, or Section 4.2.2 if using a BR/EDR transport.
- If IUT permissions for the characteristic require a specific security mode or security level,
    establish a connection meeting those requirements.
- Test Case Configuration

```
Test Case Value (Requirements) Target Setting Features
Bit (bit number)
```
### FTMS/SR/CR/BV- 02 - C [Characteristic Read – Training Status]

```
2 octets (minimum, but could
be variable as defined in [4]
4.10.1) with RFU bits set to
```
0. ([4] 4.10.1)

#### N/A

### FTMS/SR/CR/BV- 03 - C [Characteristic Read – Supported Speed Range]

```
6 octets [4] 4.11.1 Speed Target Setting
Supported (0)
```
### FTMS/SR/CR/BV- 04 - C [Characteristic Read – Supported Inclination Range]

```
6 octets [4] 4.12.1 Inclination Target Setting
Supported (1)
```
### FTMS/SR/CR/BV- 05 - C [Characteristic Read – Supported Resistance Level Range]

```
6 octets [4] 4.13.1 Resistance Target Setting
Supported (2)
```
### FTMS/SR/CR/BV- 06 - C [Characteristic Read – Supported Power Range]

```
6 octets [4] 4.14.1 Power Target Setting
Supported (3)
```
### FTMS/SR/CR/BV- 07 - C [Characteristic Read – Supported Heart Rate Range]

```
3 octets [4] 4.15.1 Heart Rate Target Setting
Supported (4)
```
```
Table 4. 4 : Characteristic Read Value test cases
```
- Test Procedure
    1. The Lower Tester sends an ATT_Read_Request to the IUT to read the characteristic value.
    2. The IUT sends an ATT_Read_Response to the Lower Tester.
    3. Verify that the characteristic value meets the requirements of the service.
- Expected Outcome

```
Pass verdict
```
```
The characteristic is successfully read, and the characteristic value meets the requirements of the
service.
```
```
The specified Target Setting Features Bit of the Target Setting Features field of the Fitness Machine
Feature characteristic is set to 1.
```
## 4.5 Configure Indication and Notification

- Test Purpose

```
Verify compliant operation in response to enabling and disabling characteristic indication or
notification. The verification is done one value at a time, as enumerated in the test cases in Table 4. 5 ,
using this generic test procedure.
```
- Reference

```
[4] 4
```

- Initial Condition
    - The handle of each characteristic value referenced in the test cases below has been previously
       discovered by the Lower Tester during the test procedure in Section 4.3 or is known to the Lower
       Tester by other means.
    - The handle of the client characteristic configuration descriptor of each characteristic referenced in
       the test cases below has been previously discovered by the Lower Tester during the test
       procedure in Section 4.3 or is known to the Lower Tester by other means.
    - If the IUT requires a bonding procedure, then perform a bonding procedure.
    - Establish an ATT Bearer connection between the Lower Tester and IUT as described in
       Section 4.2.1, if using an LE transport, or Section 4.2.2 if using a BR/EDR transport.
    - If IUT permissions for the characteristic descriptor require a specific security mode or security
       level, establish a connection meeting those requirements.
- Test Case Configuration

```
Test Case Requirements
```
## FTMS/SR/CON/BV- 01 - C [Configure Notification – Treadmill Data]

## FTMS/SR/CON/BV- 02 - C [Configure Notification – Cross trainer Data]

## FTMS/SR/CON/BV- 03 - C [Configure Notification – Step Climber Data]

## FTMS/SR/CON/BV- 04 - C [Configure Notification – Stair Climber]

## FTMS/SR/CON/BV- 05 - C [Configure Notification – Rower Data]

## FTMS/SR/CON/BV- 06 - C [Configure Notification – Indoor Bike Data]

## FTMS/SR/CON/BV- 07 - C [Configure Notification – Training Status]

## FTMS/SR/CON/BV- 08 - C [Configure Indication – Fitness Machine Control Point]

## FTMS/SR/CON/BV- 09 - C [Configure Notification – Fitness Machine Status]

```
Table 4. 5 : Configure Indication and Notification test cases
```
- Test Procedure
    1. Disable indication or notification by writing value 0x0000 to the client characteristic configuration
       descriptor of the characteristic.
    2. If the test case is for notification, enable notification by writing value 0x0001 to the client
       characteristic configuration descriptor of the characteristic.
    3. Otherwise, if the test case is for indication, enable indication by writing value 0x0002 to the client
       characteristic configuration descriptor of the characteristic.
    4. The Lower Tester reads the value of the client characteristic configuration descriptor.
- Expected Outcome

```
Pass verdict
```
```
The characteristic descriptor is successfully written and the value returned when read is consistent
with the value written.
```

## 4.6 Characteristic Notification

## FTMS/SR/CN/BV- 01 - C [Treadmill Data Notifications – Receive Complete Data Record]

- Test Purpose

```
Verify that the IUT can send notifications of the Treadmill Data characteristic that include the
mandatory fields (i.e., Flags and Instantaneous Speed fields) when complete Data Record is received
```
- Reference

```
[4] 4.4.1.1, 4.4.1.
```
- Initial Condition
    - If the IUT requires a bonding procedure, then perform a bonding procedure.
    - The Treadmill Data characteristic is configured for notification.
    - Establish an ATT Bearer connection between the Lower Tester and IUT as described in
       Section 4.2.1 if using an LE transport or Section 4.2.2 if using a BR/EDR transport.
    - If IUT permissions for the Treadmill Data characteristic require a specific security mode or
       security level, establish a connection meeting those requirements.
- Test Procedure
    1. Perform an action on the IUT that will induce it, once connected, to send Treadmill-related Data
       Record, which consists of one or more notifications of the Treadmill Data characteristic along with
       the Flags field. The Instantaneous Speed field is included if the bit flag of More Data is set to 0.
    2. A connection is established between the Lower Tester and IUT meeting the security requirements
       of the IUT, if not already done so prior to step 1.
    3. The Lower Tester reads the Fitness Machine Feature characteristic (e.g., by executing test case
       FTMS/SR/CR/BV- 01 - C [Characteristic Read – Fitness Machine Feature] or by other means).
    4. The Lower Tester receives a Data Record, which consists of one or more
       ATT_Handle_Value_Notification from the IUT containing the Treadmill Data characteristic handle
       and value.
    5. Verify that the characteristic value meets the requirements of the service.
    6. The Lower Tester configures the Treadmill Data characteristic to disable notifications.
    7. Repeat steps 1–2 with notifications disabled.
    8. Verify that the Lower Tester does not receive an ATT_Handle_Value_Notification from the IUT
       containing the Treadmill Data characteristic.
- Expected Outcome

```
Pass verdict
```
```
The IUT sends one or more Data Records where each Data Record consists of one or more
notifications of the Treadmill Data characteristic.
```
```
The Treadmill Data characteristic Data Records contain at least the Flags field, and the
Instantaneous Speed field is included when the More Data bit of the Flags field is set to 0.
```
```
The value of each field of the characteristic meets the requirements of the service.
```
```
The IUT stops sending notifications of the Treadmill Data characteristic after the Lower Tester
configures the characteristic to disable notifications.
```
```
In all cases, ensure that the RFU bits of the Flags field are set to zero.
```

## 4.6.1 Treadmill Data Notifications – Supported Fields

- Test Purpose

```
This is a generic procedure to verify that the IUT can send a Data Record consisting of one or more
notifications of the Treadmill Data characteristic that includes the supported field specified in
Table 4. 6 with a valid value. The test is repeated for each Fitness Machine Feature supported by the
IUT.
```
- Reference

```
See Table 4. 6
```
- Initial Condition
    - If the IUT requires a bonding procedure, then perform a bonding procedure.
    - The Treadmill Data characteristic is configured for notification.
    - Establish an ATT Bearer connection between the Lower Tester and IUT as described in
       Section 4.2.1, if using an LE transport, or Section 4.2.2 if using a BR/EDR transport.
    - If IUT permissions for the Treadmill Data characteristic require a specific security mode or
       security level, establish a connection meeting those requirements.
- Test Case Configuration

```
Test Case Reference Included Fields Flags Bits Fitness
Machine
Features Bit
```
## FTMS/SR/CN/BV- 02 - C [Treadmill Data Notifications – Average Speed Supported]

```
[4] 4.4.1.3 Average Speed Average Speed
Present
```
```
Average
Speed
Supported
```
## FTMS/SR/CN/BV- 03 - C [Treadmill Data Notifications – Total Distance Supported]

```
[4] 4.4.1.4 Total Distance Total Distance
Present
```
```
Total
Distance
Supported
```
## FTMS/SR/CN/BV- 04 - C [Treadmill Data Notifications – Inclination Supported]

#### [4] 4.4.1.5

#### [4] 4.4.1.6

```
Inclination, Ramp
Angle Setting
```
```
Inclination and
Ramp Angle
Setting Present
```
```
Inclination
Supported
```
## FTMS/SR/CN/BV- 05 - C [Treadmill Data Notifications – Elevation Gain Supported]

```
[4] 4.4.1.7 Positive Elevation
Gain and
Negative
Elevation Gain
Pair
```
```
Elevation Gain
Present
```
```
Elevation
Gain
Supported
```
## FTMS/SR/CN/BV- 06 - C [Treadmill Data Notifications – Pace Supported]

#### [4] 4.4.1.8

#### [4] 4.4.1.9

```
Instantaneous
Pace, Average
Pace
```
```
Instantaneous
Pace Present,
Average Pace
Present
```
```
Pace
Supported
```
## FTMS/SR/CN/BV- 07 - C [Treadmill Data Notifications – Expended Energy Supported]

#### [4] 4.4.1.10

#### [4] 4.4.1.11

#### [4] 4.4.1.12

```
Total Energy,
Energy per Hour,
Energy per
Minute
```
```
Expended
Energy Present
```
```
Expended
Energy
Supported
```

```
Test Case Reference Included Fields Flags Bits Fitness
Machine
Features Bit
```
## FTMS/SR/CN/BV- 08 - C [Treadmill Data Notifications – Heart Rate Measurement Supported]

```
[4] 4.4.1.13 Heart Rate Heart Rate
Present
```
```
Heart Rate
Measurement
Supported
```
## FTMS/SR/CN/BV- 09 - C [Treadmill Data Notifications – Metabolic Equivalent Supported]

```
[4] 4.4.1.14 Metabolic
Equivalent
```
```
Metabolic
Equivalent
Present
```
```
Metabolic
Equivalent
Supported
```
## FTMS/SR/CN/BV- 10 - C [Treadmill Data Notifications – Remaining Time Supported]

```
[4] 4.4.1.16 Remaining Time Remaining Time
Present
```
```
Remaining
Time
Supported
```
## FTMS/SR/CN/BV- 11 - C [Treadmill Data Notifications – Force On Belt and Power Output Supported]

#### [4] 4.4.1.17

#### [4] 4.4.1.18

```
Force on Belt,
Power Output
```
```
Force on Belt and
Power Output
Present
```
```
Force on Belt
and Power
Output
Supported
```
```
Table 4. 6 : Treadmill Data Notifications – Supported Fields
```
- Test Procedure
    1. Perform an action on the IUT that will induce it, once connected, to send a treadmill-related Data
       Record, which consists of one or more notifications of the Treadmill Data characteristic. The Data
       Record contains the Included Fields specified in Table 4. 6.
    2. A connection is established between the Lower Tester and IUT meeting the security requirements
       of the IUT, if not already done so prior to step 1.
    3. The Lower Tester reads the Fitness Machine Feature characteristic (e.g., by executing test case
       FTMS/SR/CR/BV- 01 - C [Characteristic Read – Fitness Machine Feature] or by other means).
    4. The Lower Tester receives a Data Record, which consists of one or more
       ATT_Handle_Value_Notification from the IUT containing the Treadmill Data characteristic handle
       and value.
    5. Verify that the characteristic value meets the requirements of the service.
    6. Repeat steps 4–5 until the Lower Tester receives a Data Record with the Included Fields
       specified in Table 4. 6.
    7. The Lower Tester configures the Treadmill Data characteristic to disable notifications.
- Expected Outcome

```
Pass verdict
```
```
The IUT sends one or more Data Records where each Data Record consists of one or more
notifications of the Treadmill Data characteristic.
```
```
The Data Records contain at least the Flags field, and the Included Fields are present when the
specified Flags Bits are set to 1.
```
```
The values for the specified Included Fields meet the requirements of the service.
```
```
The specified Fitness Machine Features Bit of the Fitness Machine Features field of the Fitness
Machine Feature characteristic is set to 1.
```
```
In all cases, ensure that the RFU bits of the Flags field are set to zero.
```

## FTMS/SR/CN/BV- 12 - C [Treadmill Data Notifications – Elapsed Time]

- Test Purpose

```
Verify that the IUT can send notifications of the Treadmill Data characteristic that include the Elapsed
Time value. Additionally, verify that when link loss occurs while the server sends a Data Record, the
Data Record is discarded and not sent to the Client if the connection is re-established.
```
- Reference

```
[4] 4.4.1.15, 4.18
```
- Initial Condition
    - If the IUT requires a bonding procedure, then perform a bonding procedure.
    - The Treadmill Data characteristic is configured for notification.
    - Establish an ATT Bearer connection between the Lower Tester and IUT as described in
       Section 4.2.1, if using an LE transport, or Section 4.2.2 if using a BR/EDR transport.
    - If IUT permissions for the Treadmill Data characteristic require a specific security mode or
       security level, establish a connection meeting those requirements.
- Test Procedure
    1. Perform an action on the IUT that will induce it, once connected, to send treadmill-related Data
       Record, which consists of one or more notifications of the Treadmill Data characteristic along with
       the Elapsed Time field (e.g., start a training session).
    2. A connection is established between the Lower Tester and IUT meeting the security requirements
       of the IUT, if not already done so prior to step 1.
    3. The Lower Tester reads the Fitness Machine Feature characteristic (e.g., by executing test case
       FTMS/SR/CR/BV- 01 - C [Characteristic Read – Fitness Machine Feature] or by other means).
    4. The Lower Tester receives a Data Record, which consists of one or more
       ATT_Handle_Value_Notification from the IUT containing the Treadmill Data characteristic handle
       and value.
    5. Verify that the characteristic value meets the requirements of the service.
    6. Repeat steps 4–5 until the Lower Tester receives a Data Record, which includes the Elapsed
       Time field.
    7. The Lower Tester terminates the link between the IUT and the Lower Tester.
    8. After 10 seconds, reestablish the connection between the Lower Tester and IUT meeting the
       security requirements of the IUT.
    9. The Lower Tester receives Data Record, which consists of one or more
       ATT_Handle_Value_Notification from the IUT containing the Treadmill Data characteristic handle
       and value.
    10. Verify that the characteristic value meets the requirements of the service.
    11. Repeat steps 9–10 until the Lower Tester receives a Data Record, which includes the Elapsed
       Time field.
    12. The Lower Tester configures the Treadmill Data characteristic to disable notifications.
- Expected Outcome

```
Pass verdict
```
```
The IUT sends one or more Data Records where each Data Record consists of one or more
notifications of the Treadmill Data characteristic.
```
```
The Treadmill Data Characteristic Data Records contain at least the Flags field and the Elapsed Time
value is included when the Elapsed Time Present bit of the Flags field is set to 1.
```

```
The value of each field of the characteristic meets the requirements of the service.
```
```
The value of the Elapsed Time Supported bit of the Fitness Machine Feature characteristic is set to 1.
```
```
In all cases, ensure that the RFU bits of the Flags field are set to zero.
```
```
After step 8 , the IUT sends one or more Data Records where each Data Record consists of one or
more notifications of the Treadmill Data characteristic until the Elapsed Time field is present. The
Elapsed Time value received in step 9 is at least 9 seconds later than the Elapsed Time value
received in step 4.
```
## FTMS/SR/CN/BV- 13 - C [Cross Trainer Data Notifications – Receive Complete Data Record]..............................

- Test Purpose

```
Verify that the IUT can send notifications of the Cross Trainer Data characteristic that include the
mandatory fields (i.e., Flags and Instantaneous Speed fields) when complete Data Record is
received.
```
- Reference

```
[4] 4.5.1.1, 4.5.1.2
```
- Initial Condition
    - If the IUT requires a bonding procedure, then perform a bonding procedure.
    - The Cross Trainer Data characteristic is configured for notification.
    - Establish an ATT Bearer connection between the Lower Tester and IUT as described in
       Section 4.2.1, if using an LE transport, or Section 4.2.2 if using a BR/EDR transport.
    - If IUT permissions for the Cross Trainer Data characteristic require a specific security mode or
       security level, establish a connection meeting those requirements.
- Test Procedure
    1. Perform an action on the IUT that will induce it, once connected, to send cross trainer-related
       Data Record, which consists of one or more notifications of the Cross Trainer Data characteristic
       along with the Flags field and the Instantaneous Speed field.
    2. A connection is established between the Lower Tester and IUT meeting the security requirements
       of the IUT, if not already done so prior to step 1.
    3. The Lower Tester reads the Fitness Machine Feature characteristic (e.g., by executing test case
       FTMS/SR/CR/BV- 01 - C [Characteristic Read – Fitness Machine Feature] or by other means).
    4. The Lower Tester receives a Data Record, which consists of one or more
       ATT_Handle_Value_Notification from the IUT containing the Cross Trainer Data characteristic
       handle and value.
    5. Verify that the characteristic value meets the requirements of the service.
    6. The Lower Tester configures the Cross Trainer Data characteristic to disable notifications.
    7. Repeat steps 1–2 with notifications disabled.
    8. Verify that the Lower Tester does not receive an ATT_Handle_Value_Notification from the IUT
       containing the Cross Trainer Data characteristic.


- Expected Outcome

```
Pass verdict
```
```
The IUT sends one or more Data Records where each Data Record consists of one or more
notifications of the Cross Trainer Data characteristic.
```
```
The Cross Trainer Data Characteristic Data Records contain at least the Flags field and the
Instantaneous Speed field is included when the More Data bit of the Flags field is set to 0.
```
```
The value of each field of the characteristic meets the requirements of the service.
```
```
The IUT stops sending notifications of the Cross Trainer Data characteristic after the Lower Tester
configures the characteristic to disable notifications.
```
```
In all cases, ensure that the RFU bits of the Flags field are set to zero.
```
## 4.6.2 Cross Trainer Data Notifications – Supported Fields

- Test Purpose

```
This is a generic procedure to verify that the IUT can send a Data Record consisting of one or more
notifications of the Cross Trainer Data characteristic that include the supported field specified in
Table 4. 7 with a valid value/s. The test is repeated for each Fitness Machine Feature supported by
the IUT.
```
- Reference

```
See Table 4. 7.
```
- Initial Condition
    - If the IUT requires a bonding procedure, then perform a bonding procedure.
    - The Cross Trainer Data characteristic is configured for notification.
    - Establish an ATT Bearer connection between the Lower Tester and IUT as described in
       Section 4.2.1, if using an LE transport, or Section 4.2.2 if using a BR/EDR transport.
    - If IUT permissions for the Cross Trainer Data characteristic require a specific security mode or
       security level, establish a connection meeting those requirements.
- Test Case Configuration

```
Test Case Reference Included Fields Flags Bits Fitness
Machine
Features Bit
```
## FTMS/SR/CN/BV- 14 - C [Cross Trainer Data Notifications – Average Speed Supported]

```
[4] 4.5.1.3 Average Speed Average Speed
Present
```
```
Average
Speed
Supported
```
## FTMS/SR/CN/BV- 15 - C [Cross Trainer Data Notifications – Total Distance Supported]

```
[4] 4.5.1.4 Total Distance Total Distance
Present
```
```
Total
Distance
Supported
```
## FTMS/SR/CN/BV- 16 - C [Cross Trainer Data Notifications – Step Count Supported]

#### [4] 4.5.1.5

#### [4] 4.5.1.6

```
Step per Minute,
Average Step
Rate
```
```
Step Count
Present
```
```
Step Count
Supported
```

```
Test Case Reference Included Fields Flags Bits Fitness
Machine
Features Bit
```
## FTMS/SR/CN/BV- 17 - C [Cross Trainer Data Notifications – Stride Count Supported]

```
[4] 4.5.1.7 Stride Count Stride Count
Present
```
```
Stride Count
Supported
```
## FTMS/SR/CN/BV- 18 - C [Cross Trainer Data Notifications – Elevation Gain Supported]

```
[4] 4.5.1.8 Positive Elevation
Gain and
Negative
Elevation Gain
```
```
Elevation Gain
Present
```
```
Elevation
Gain
Supported
```
## FTMS/SR/CN/BV- 19 - C [Cross Trainer Data Notifications – Inclination Supported]

#### [4] 4.5.1.9

#### [4] 4.5.1.10

```
Inclination, Ramp
Angle Setting
```
```
Inclination and
Ramp Angle
Setting Present
```
```
Inclination
Supported
```
## FTMS/SR/CN/BV- 20 - C [Cross Trainer Data Notifications – Resistance Level Supported]

```
[4] 4.5.1.11 Resistance Level Resistance Level
Present
```
```
Resistance
Level
Supported
```
## FTMS/SR/CN/BV- 21 - C [Cross Trainer Data Notifications – Power Measurement Supported]

#### [4] 4.5.1.12

#### [4] 4.5.1.13

```
Instantaneous
Power, Average
Power
```
```
Instantaneous
Power Present,
Average Power
Present
```
```
Power
Measurement
Supported
```
## FTMS/SR/CN/BV- 22 - C [Cross Trainer Data Notifications – Expended Energy Supported]

#### [4] 4.5.1.14

#### [4] 4.5.1.15

#### [4] 4.5.1.16

```
Total Energy,
Energy per Hour,
Energy per
Minute
```
```
Expended
Energy Present
```
```
Expended
Energy
Supported
```
## FTMS/SR/CN/BV- 23 - C [Cross Trainer Data Notifications – Heart Rate Measurement Supported]

```
[4] 4.5.1.17 Heart Rate Heart Rate
Present
```
```
Heart Rate
Measurement
Supported
```
## FTMS/SR/CN/BV- 24 - C [Cross Trainer Data Notifications – Metabolic Equivalent Supported]

```
[4] 4.5.1.18 Metabolic
Equivalent
```
```
Metabolic
Equivalent
Present
```
```
Metabolic
Equivalent
Supported
```
## FTMS/SR/CN/BV- 26 - C [Cross Trainer Data Notifications – Remaining Time Supported]

```
[4] 4.5.1.20 Remaining Time Remaining Time
Present
```
```
Remaining
Time
Supported
```
```
Table 4. 7 : Cross Trainer Data Notifications – Supported Fields test cases
```
- Test Procedure
    1. Perform an action on the IUT that will induce it, once connected, to send a cross trainer-related
       Data Record, which consists of one or more notifications of the Cross Trainer Data characteristic.
       The Data Record contains the Included Fields specified in Table 4. 7.
    2. A connection is established between the Lower Tester and IUT meeting the security requirements
       of the IUT, if not already done so prior to step 1.
    3. The Lower Tester reads the Fitness Machine Feature characteristic (e.g. by executing test case
       FTMS/SR/CR/BV- 01 - C [Characteristic Read – Fitness Machine Feature] or by other means).
    4. The Lower Tester receives a Data Record, which consists of one or more
       ATT_Handle_Value_Notification from the IUT containing the Cross Trainer Data characteristic
       handle and value.


5. Verify that the characteristic value meets the requirements of the service.
6. Repeat steps 4–5 until the Lower Tester receives a Data Record with the Included Fields
    specified in Table 4. 7.
7. The Lower Tester configures the Cross Trainer Data characteristic to disable notifications.
- Expected Outcome

```
Pass verdict
```
```
The IUT sends one or more Data Records where each Data Record consists of one or more
notifications of the Cross Trainer Data characteristic.
```
```
The Cross Trainer Data Characteristic Data Records contain at least the Flags field, and the Included
Fields are present when the specified Flags Bits are set to 1.
```
```
The values for the specified Included Fields meet the requirements of the service.
```
```
The specified Fitness Machine Features Bit of the Fitness Machine Feature characteristic is set to 1.
```
```
In all cases, ensure that the RFU bits of the Flags field are set to zero.
```
## FTMS/SR/CN/BV- 25 - C [Cross Trainer Data Notifications – Elapsed Time]

- Test Purpose

```
Verify that the IUT can send notifications of the Cross Trainer Data characteristic that include the
Elapsed Time value. Additionally, verify that when link loss occurs while the server sends a Data
Record, the Data Record is discarded and not sent to the Client if the connection is re-established.
```
- Reference

```
[4] 4.5.1.19, 4.18
```
- Initial Condition
    - If the IUT requires a bonding procedure, then perform a bonding procedure.
    - The Cross Trainer Data characteristic is configured for notification.
    - Establish an ATT Bearer connection between the Lower Tester and IUT as described in
       Section 4.2.1, if using an LE transport, or Section 4.2.2 if using a BR/EDR transport.
    - If IUT permissions for the Cross Trainer Data characteristic require a specific security mode or
       security level, establish a connection meeting those requirements.
- Test Procedure
    1. Perform an action on the IUT that will induce it, once connected, to send cross trainer-related
       Data Record, which consists of one or more notifications of the Cross Trainer Data characteristic
       along with the Elapsed Time field (e.g., start a training session).
    2. A connection is established between the Lower Tester and IUT meeting the security requirements
       of the IUT, if not already done so prior to step 1.
    3. The Lower Tester reads the Fitness Machine Feature characteristic (e.g., by executing test case
       FTMS/SR/CR/BV- 01 - C [Characteristic Read – Fitness Machine Feature] or by other means).
    4. The Lower Tester receives a Data Record, which consists of one or more
       ATT_Handle_Value_Notification from the IUT containing the Cross Trainer Data characteristic
       handle and value.
    5. Verify that the characteristic value meets the requirements of the service.
    6. Repeat steps 4–5 until the Lower Tester receives a Data Record, which includes the Elapsed
       Time field.


7. The Lower Tester terminates the link between the IUT and the Lower Tester.
8. After 10 seconds, reestablish the connection between the Lower Tester and IUT meeting the
    security requirements of the IUT.
9. The Lower Tester receives Data Record, which consists of one or more
    ATT_Handle_Value_Notification from the IUT containing the Cross Trainer Data characteristic
    handle and value.
10. Verify that the characteristic value meets the requirements of the service.
11. Repeat steps 9–10 until the Lower Tester receives a Data Record, which includes the Elapsed
    Time field.
12. The Lower Tester configures the Cross Trainer Data characteristic to disable notifications.
- Expected Outcome

```
Pass verdict
```
```
The IUT sends one or more Data Records where each Data Record consists of one or more
notifications of the Cross Trainer Data characteristic.
```
```
The Cross Trainer Data characteristic Data Records contain at least the Flags field and at least one
includes the Elapsed Time value is included when the Elapsed Time Present bit of the Flags field is
set to 1.
```
```
The value of each field of the characteristic meets the requirements of the service.
```
```
The value of the Elapsed Time Supported bit of the Fitness Machine Feature characteristic is set to 1.
```
```
In all cases, ensure that the RFU bits of the Flags field are set to zero.
```
```
After step 8 , the IUT sends one or more Data Records where each Data Record consists of one or
more notifications of the Cross Trainer Data characteristic until the Elapsed Time field is present. The
Elapsed Time value received in step 9 is at least 9 seconds later than the Elapsed Time value
received in step 4.
```
## FTMS/SR/CN/BV- 27 - C [Step Climber Data Notifications – Receive Complete Data Record]

- Test Purpose

```
Verify that the IUT can send notifications of the Step Climber Data characteristic that include the
mandatory fields (i.e., Flags, Floors, and Step Count fields) when complete Data Record is received.
```
- Reference

```
[4] 4.6.1.1, 4.6.1.2, 4.6.1.3
```
- Initial Condition
    - If the IUT requires a bonding procedure, then perform a bonding procedure.
    - The Step Climber Data characteristic is configured for notification.
    - Establish an ATT Bearer connection between the Lower Tester and IUT as described in
       Section 4.2.1, if using an LE transport, or Section 4.2.2 if using a BR/EDR transport.
    - If IUT permissions for the Step Climber Data characteristic require a specific security mode or
       security level, establish a connection meeting those requirements.


- Test Procedure
    1. Perform an action on the IUT that will induce it, once connected, to send step climber-related
       Data Record, which consists of one or more notifications of the Step Climber Data characteristic
       along with the Flags field, Floors field, and the Step per Minute field.
    2. A connection is established between the Lower Tester and IUT meeting the security requirements
       of the IUT, if not already done so prior to step 1.
    3. The Lower Tester reads the Fitness Machine Feature characteristic (e.g., by executing test case
       FTMS/SR/CR/BV- 01 - C [Characteristic Read – Fitness Machine Feature] or by other means).
    4. The Lower Tester receives a Data Record, which consists of one or more
       ATT_Handle_Value_Notification from the IUT containing the Step Climber Data characteristic
       handle and value.
    5. Verify that the characteristic value meets the requirements of the service.
    6. The Lower Tester configures the Step Climber Data characteristic to disable notifications.
    7. Repeat steps 1–2 with notifications disabled.
    8. Verify that the Lower Tester does not receive an ATT_Handle_Value_Notification from the IUT
       containing the Step Climber Data characteristic.
- Expected Outcome

```
Pass verdict
```
```
The IUT sends one or more Data Records where each Data Record consists of one or more
notifications of the Step Climber Data characteristic.
```
```
The Step Climber Data characteristic Data Records contain at least the Flags field, Floors field, and
the Steps Per Minute field are included when the More Data bit of the Flags field is set to 0.
```
```
The value of each field of the characteristic meets the requirements of the service.
```
```
The IUT stops sending notifications of the Step Climber Data characteristic after the Lower Tester
configures the characteristic to disable notifications.
```
```
In all cases, ensure that the RFU bits of the Flags field are set to zero.
```
## 4.6.3 Step Climber Data Notifications – Supported Fields

- Test Purpose

```
This is a generic procedure to verify that the IUT can send a Data Record consisting of one or more
notifications of the Step Climber Data characteristic that include the supported field specified in
Table 4. 8 with a valid value. The test is repeated for each Fitness Machine Feature supported by the
IUT.
```
- Reference

```
See Table 4. 8.
```
- Initial Condition
    - If the IUT requires a bonding procedure, then perform a bonding procedure.
    - The Step Climber Data characteristic is configured for notification.
    - Establish an ATT Bearer connection between the Lower Tester and IUT as described in
       Section 4.2.1, if using an LE transport, or Section 4.2.2 if using a BR/EDR transport.
    - If IUT permissions for the Step Climber Data characteristic require a specific security mode or
       security level, establish a connection meeting those requirements.


- Test Case Configuration

```
Test Case Reference Included
Fields
```
```
Flags Bits Fitness Machine
Features Bit
```
## FTMS/SR/CN/BV- 28 - C [Step Climber Data Notifications – Step Count Supported]

#### [4] 4.6.1.4

#### [4] 4.6.1.5

```
Step per
Minute,
Average Step
Rate
```
```
Step per
Minute
Present, Step
Count Present
```
```
Step Count
Supported
```
## FTMS/SR/CN/BV- 29 - C [Step Climber Data Notifications – Elevation Gain Supported]

```
[4] 4.6.1.6 Positive
Elevation
Gain
```
```
Positive
Elevation Gain
Present
```
```
Elevation Gain
Supported
```
## FTMS/SR/CN/BV- 30 - C [Step Climber Data Notifications – Expended Energy Supported]

#### [4] 4.6.1.7

#### [4] 4.6.1.8

#### [4] 4.6.1.9

```
Total Energy,
Energy per
Hour, Energy
per Minute
```
```
Expended
Energy
Present
```
```
Expended Energy
Supported
```
## FTMS/SR/CN/BV- 31 - C [Step Climber Data Notifications – Heart Rate Measurement Supported]

```
[4] 4.6.1.10 Heart Rate Heart Rate
Present
```
```
Heart Rate
Measurement
Supported
```
## FTMS/SR/CN/BV- 32 - C [Step Climber Data Notifications – Metabolic Equivalent Supported]

```
[4] 4.6.1.11 Metabolic
Equivalent
```
```
Metabolic
Equivalent
Present
```
```
Metabolic Equivalent
Supported
```
## FTMS/SR/CN/BV- 34 - C [Step Climber Data Notifications – Remaining Time Supported]

```
[4] 4.6.1.13 Remaining
Time
```
```
Remaining
Time Present
```
```
Remaining Time
Supported
```
```
Table 4. 8 : Step Climber Data Notifications – Supported Fields test cases
```
- Test Procedure
    1. Perform an action on the IUT that will induce it, once connected, to send a step climber-related
       Data Record, which consists of one or more notifications of the Step Climber Data characteristic.
       The Data Record contains the Included Fields specified in Table 4. 8.
    2. A connection is established between the Lower Tester and IUT meeting the security requirements
       of the IUT, if not already done so prior to step 1.
    3. The Lower Tester reads the Fitness Machine Feature characteristic (e.g., by executing test case
       FTMS/SR/CR/BV- 01 - C [Characteristic Read – Fitness Machine Feature] or by other means).
    4. The Lower Tester receives a Data Record, which consists of one or more
       ATT_Handle_Value_Notification from the IUT containing the Step Climber Data characteristic
       handle and value.
    5. Verify that the characteristic value meets the requirements of the service.
    6. Repeat steps 4–5 until the Lower Tester receives a Data Record with the Included Fields
       specified in Table 4. 8.
    7. The Lower Tester configures the Step Climber Data characteristic to disable notifications.


- Expected Outcome

```
Pass verdict
```
```
The IUT sends one or more Data Records where each Data Record consists of one or more
notifications of the Step Climber Data characteristic.
```
```
The Step Climber Data characteristic Data Records contain at least the Flags field, and the Included
Fields are present when the specified Flags Bits are set to 1.
```
```
The values for the specified Included Fields meet the requirements of the service.
```
```
The specified Fitness Machine Features Bit of the Fitness Machine Features field of the Fitness
Machine Feature characteristic is set to 1.
```
```
In all cases, ensure that the RFU bits of the Flags field are set to zero.
```
## FTMS/SR/CN/BV- 33 - C [Step Climber Data Notifications – Elapsed Time]

- Test Purpose

```
Verify that the IUT can send notifications of the Step Climber Data characteristic that include the
Elapsed Time value. Additionally, verify that when link loss occurs while the server sends a Data
Record, the Data Record is discarded and not sent to the Client if the connection is re-established.
```
- Reference

```
[4] 4.6.1.12, 4.18
```
- Initial Condition
    - If the IUT requires a bonding procedure, then perform a bonding procedure.
    - The Step Climber Data characteristic is configured for notification.
    - Establish an ATT Bearer connection between the Lower Tester and IUT as described in
       Section 4.2.1, if using an LE transport, or Section 4.2.2 if using a BR/EDR transport.
    - If IUT permissions for the Step Climber Data characteristic require a specific security mode or
       security level, establish a connection meeting those requirements.
- Test Procedure
    1. Perform an action on the IUT that will induce it, once connected, to send step climber-related
       Data Record, which consists of one or more notifications of the Step Climber Data characteristic
       along with the Elapsed Time field (e.g., start a training session).
    2. A connection is established between the Lower Tester and IUT meeting the security requirements
       of the IUT, if not already done so prior to step 1.
    3. The Lower Tester reads the Fitness Machine Feature characteristic (e.g., by executing test case
       FTMS/SR/CR/BV- 01 - C [Characteristic Read – Fitness Machine Feature] or by other means).
    4. The Lower Tester receives a Data Record, which consists of one or more
       ATT_Handle_Value_Notification from the IUT containing the Step Climber Data characteristic
       handle and value.
    5. Verify that the characteristic value meets the requirements of the service.
    6. Repeat steps 4–5 until the Lower Tester receives a Data Record, which includes the Elapsed
       Time field.
    7. The Lower Tester terminates the link between the IUT and the Lower Tester.
    8. After 10 seconds, re-establish the connection between the Lower Tester and IUT meeting the
       security requirements of the IUT.


9. The Lower Tester receives Data Record, which consists of one or more
    ATT_Handle_Value_Notification from the IUT containing the Treadmill Data characteristic handle
    and value.
10. Verify that the characteristic value meets the requirements of the service.
11. Repeat steps 9–10 until the Lower Tester receives a Data Record, which includes the Elapsed
    Time field.
12. The Lower Tester configures the Step Climber Data characteristic to disable notifications.
- Expected Outcome

```
Pass verdict
```
```
The IUT sends one or more Data Records where each Data Record consists of one or more
notifications of the Step Climber Data characteristic.
```
```
The Step Climber Data characteristic Data Records contain at least the Flags field and the Elapsed
Time value is included when the Elapsed Time Present bit of the Flags field is set to 1.
```
```
The value of each field of the characteristic meets the requirements of the service.
```
```
The value of the Elapsed Time Supported bit of the Fitness Machine Feature characteristic is set to 1.
```
```
In all cases, ensure that the RFU bits of the Flags field are set to zero.
```
```
After step 8 , the IUT sends one or more Data Records where each Data Record consists of one or
more notifications of the Step Climber Data characteristic until the Elapsed Time field is present. The
Elapsed Time value received in step 9 is at least 9 seconds later than the Elapsed Time value
received in step 4.
```
## FTMS/SR/CN/BV- 35 - C [Stair Climber Data Notifications – Receive Complete Data Record]

- Test Purpose

```
Verify that the IUT can send notifications of the Stair Climber Data characteristic that include the
mandatory fields (i.e., Flags, and Floors fields) when complete Data Record is received.
```
- Reference

```
[4] 4.7.1.1, 4.7.1.2
```
- Initial Condition
    - If the IUT requires a bonding procedure, then perform a bonding procedure.
    - The Stair Climber Data characteristic is configured for notification.
    - Establish an ATT Bearer connection between the Lower Tester and IUT as described in
       Section 4.2.1, if using an LE transport, or Section 4.2.2 if using a BR/EDR transport.
    - If IUT permissions for the Stair Climber Data characteristic require a specific security mode or
       security level, establish a connection meeting those requirements.
- Test Procedure
    1. Perform an action on the IUT that will induce it, once connected, to send stair climber-related
       Data Record, which consists of one or more notifications of the Stair Climber Data characteristic
       along with the Flags field, and Floors field.
    2. A connection is established between the Lower Tester and IUT meeting the security requirements
       of the IUT, if not already done so prior to step 1.
    3. The Lower Tester reads the Fitness Machine Feature characteristic (e.g., by executing test case
       FTMS/SR/CR/BV- 01 - C [Characteristic Read – Fitness Machine Feature] or by other means).


4. The Lower Tester receives a Data Record, which consists of one or more
    ATT_Handle_Value_Notification from the IUT containing the Stair Climber Data characteristic
    handle and value.
5. Verify that the characteristic value meets the requirements of the service.
6. The Lower Tester configures the Stair Climber Data characteristic to disable notifications.
7. Repeat steps 1–2 with notifications disabled.
8. Verify that the Lower Tester does not receive the complete Data Record, which consists of an
    ATT_Handle_Value_Notification from the IUT containing the Stair Climber Data characteristic.
- Expected Outcome

```
Pass verdict
```
```
The IUT sends one or more Data Records where each Data Record consists of one or more
notifications of the Stair Climber Data characteristic.
```
```
The Stair Climber Data characteristic Data Records contain at least the Flags field and the Floors
field is included when the More Data bit of the Flags field is set to 0.
```
```
The value of each field of the characteristic meets the requirements of the service.
```
```
The IUT stops sending notifications of the Stair Climber Data characteristic after the Lower Tester
configures the characteristic to disable notifications.
```
```
In all cases, ensure that the RFU bits of the Flags field are set to zero.
```
## 4.6.4 Stair Climber Data Notifications – Supported Fields

- Test Purpose

```
This is a generic procedure to verify that the IUT can send a Data Record consisting of one or more
notifications of the Step Climber Data characteristic that include the supported field specified in
Table 4. 9 with a valid value. The test is repeated for each Fitness Machine Feature supported by the
IUT.
```
- Reference

```
See Table 4. 9
```
- Initial Condition
    - If the IUT requires a bonding procedure, then perform a bonding procedure.
    - The Stair Climber Data characteristic is configured for notification.
    - Establish an ATT Bearer connection between the Lower Tester and IUT as described in
       Section 4.2.1, if using an LE transport, or Section 4.2.2 if using a BR/EDR transport.
    - If IUT permissions for the Stair Climber Data characteristic require a specific security mode or
       security level, establish a connection meeting those requirements.


- Test Case Configuration

```
Test Case Reference Included Fields Flags Bits Fitness
Machine
Features Bit
```
## FTMS/SR/CN/BV- 36 - C [Stair Climber Data Notifications – Step Count Supported]

#### [4] 4.7.1.3

#### [4] 4.7.1.4

```
Step per Minute,
Average Step
Rate
```
```
Step per Minute
Present, Step
Count Present
```
```
Step Count
Supported
```
## FTMS/SR/CN/BV- 37 - C [Stair Climber Data Notifications – Elevation Gain Supported]

```
[4] 4.7.1.5 Positive Elevation
Gain
```
```
Positive Elevation
Gain Present
```
```
Elevation
Gain
Supported
```
## FTMS/SR/CN/BV- 38 - C [Stair Climber Data Notifications – Stride Count Supported]

```
[4] 4.7.1.6 Stride Count Stride Count
Present
```
```
Stride Count
Supported
```
## FTMS/SR/CN/BV- 39 - C [Stair Climber Data Notifications – Expended Energy Supported]

#### [4] 4.7.1.7

#### [4] 4.7.1.8

#### [4] 4.7.1.9

```
Total Energy,
Energy per Hour,
Energy per
Minute
```
```
Expended
Energy Present
```
```
Expended
Energy
Supported
```
## FTMS/SR/CN/BV- 40 - C [Stair Climber Data Notifications – Heart Rate Measurement Supported]

```
[4] 4.7.1.10 Heart Rate Heart Rate
Present
```
```
Heart Rate
Measurement
Supported
```
## FTMS/SR/CN/BV- 41 - C [Stair Climber Data Notifications – Metabolic Equivalent Supported]

```
[4] 4.7.1.11 Metabolic
Equivalent
```
```
Metabolic
Equivalent
Present
```
```
Metabolic
Equivalent
Supported
```
## FTMS/SR/CN/BV- 43 - C [Stair Climber Data Notifications – Remaining Time Supported]

```
[4] 4.7.1.13 Remaining Time Remaining Time
Present
```
```
Remaining
Time
Supported
```
```
Table 4. 9 : Stair Climber Data Notifications – Supported Fields test cases
```
- Test Procedure
    1. Perform an action on the IUT that will induce it, once connected, to send a stair climber-related
       Data Record, which consists of one or more notifications of the Stair Climber Data characteristic.
       The Data Record contains the Included Fields specified in Table 4. 9.
    2. A connection is established between the Lower Tester and IUT meeting the security requirements
       of the IUT, if not already done so prior to step 1.
    3. The Lower Tester reads the Fitness Machine Feature characteristic (e.g., by executing test case
       FTMS/SR/CR/BV- 01 - C [Characteristic Read – Fitness Machine Feature] or by other means).
    4. The Lower Tester receives a Data Record, which consists of one or more
       ATT_Handle_Value_Notification from the IUT containing the Stair Climber Data characteristic
       handle and value.
    5. Verify that the characteristic value meets the requirements of the service.
    6. Repeat steps 4–5 until the Lower Tester receives a Data Record with the Included Fields
       specified in Table 4. 9.
    7. The Lower Tester configures the Stair Climber Data characteristic to disable notifications.


- Expected Outcome

```
Pass verdict
```
```
The IUT sends one or more Data Records where each Data Record consists of one or more
notifications of the Stair Climber Data characteristic.
```
```
The Data Records contain at least the Flags field, and the Included Fields are present when the
specified Flags Bits are set to 1.
```
```
The values for the specified Included Fields meet the requirements of the service.
```
```
The specified Fitness Machine Features Bit of the Fitness Machine Features field of the Fitness
Machine Feature characteristic is set to 1.
```
```
In all cases, ensure that the RFU bits of the Flags field are set to zero.
```
## FTMS/SR/CN/BV- 42 - C [Stair Climber Data Notifications – Elapsed Time]

- Test Purpose

```
Verify that the IUT can send notifications of the Stair Climber Data characteristic that include the
Elapsed Time value when complete Data Record is received. Additionally, verify that when link loss
occurs while the server sends a Data Record, the Data Record is discarded and not sent to the Client
if the connection is re-established.
```
- Reference

```
[4] 4.7.1.12
```
- Initial Condition
    - If the IUT requires a bonding procedure, then perform a bonding procedure.
    - The Stair Climber Data characteristic is configured for notification.
    - Establish an ATT Bearer connection between the Lower Tester and IUT as described in
       Section 4.2.1, if using an LE transport, or Section 4.2.2 if using a BR/EDR transport.
    - If IUT permissions for the Stair Climber Data characteristic require a specific security mode or
       security level, establish a connection meeting those requirements.
- Test Procedure
    1. Perform an action on the IUT that will induce it, once connected, to send a stair climber-related
       Data Record, which consists of one or more notifications of the Stair Climber Data characteristic
       along with the Elapsed Time field (e.g., start a training session).
    2. A connection is established between the Lower Tester and IUT meeting the security requirements
       of the IUT, if not already done so prior to step 1.
    3. The Lower Tester reads the Fitness Machine Feature characteristic (e.g., by executing test case
       FTMS/SR/CR/BV- 01 - C [Characteristic Read – Fitness Machine Feature] or by other means).
    4. The Lower Tester receives a Data Record, which consists of one or more
       ATT_Handle_Value_Notification from the IUT containing the Stair Climber Data characteristic
       handle and value.
    5. Verify that the characteristic value meets the requirements of the service.
    6. Repeat steps 4–5 until the Lower Tester receives a Data Record, which includes the Elapsed
       Time field.
    7. The Lower Tester terminates the link between the IUT and the Lower Tester.
    8. After 10 seconds, reestablish the connection between the Lower Tester and IUT meeting the
       security requirements of the IUT.


9. The Lower Tester receives Data Record, which consists of one or more
    ATT_Handle_Value_Notification from the IUT containing the Step Climber Data characteristic
    handle and value.
10. Verify that the characteristic value meets the requirements of the service.
11. Repeat steps 9–10 until the Lower Tester receives a Data Record, which includes the Elapsed
    Time field.
12. The Lower Tester configures the Stair Climber Data characteristic to disable notifications.
- Expected Outcome

```
Pass verdict
```
```
The IUT sends one or more Data Records where each Data Record consists of one or more
notifications of the Stair Climber Data characteristic.
```
```
The Data Records contain at least the Flags field and the Elapsed Time value is included when the
Elapsed Time Present bit of the Flags field is set to 1.
```
```
The value of each field of the characteristic meets the requirements of the service.
```
```
The value of the Elapsed Time Supported bit of the Fitness Machine Feature characteristic is set to 1.
```
```
In all cases, ensure that the RFU bits of the Flags field are set to zero.
```
```
After step 8 the IUT sends one or more Data Records where each Data Record consists of one or
more notifications of the Stair Climber data characteristic until the Elapsed Time field is present. The
Elapsed Time value received in step 9 is at least 9 seconds later than the Elapsed Time value
received in step 4.
```
## FTMS/SR/CN/BV- 44 - C [Rower Data Notifications – Receive Complete Data Record]

- Test Purpose

```
Verify that the IUT can send notifications of the Rower Data characteristic that include the mandatory
fields (i.e., Flags, Stroke Rate, and Stroke Count fields) when complete Data Record is received.
```
- Reference

```
[4] 4.8.1.1, 4.8.1.2, 4.8.1.3
```
- Initial Condition
    - If the IUT requires a bonding procedure, then perform a bonding procedure.
    - The Rower Data characteristic is configured for notification.
    - Establish an ATT Bearer connection between the Lower Tester and IUT as described in
       Section 4.2.1, if using an LE transport, or Section 4.2.2 if using a BR/EDR transport.
    - If IUT permissions for the Rower Data characteristic require a specific security mode or security
       level, establish a connection meeting those requirements.
- Test Procedure
    1. Perform an action on the IUT that will induce it, once connected, to send rower-related Data
       Record, which consists of one or more notifications of the Rower Data characteristic along with
       the Flags field, Stroke Rate, and Stroke Count field.
    2. A connection is established between the Lower Tester and IUT meeting the security requirements
       of the IUT, if not already done so prior to step 1.
    3. The Lower Tester reads the Fitness Machine Feature characteristic (e.g., by executing test case
       FTMS/SR/CR/BV- 01 - C [Characteristic Read – Fitness Machine Feature] or by other means).


4. The Lower Tester receives a Data Record, which consists of one or more
    ATT_Handle_Value_Notification from the IUT containing the Rower Data characteristic handle
    and value.
5. Verify that the characteristic value meets the requirements of the service.
6. The Lower Tester configures the Rower Data characteristic to disable notifications.
7. Repeat steps 1–2 with notifications disabled.
8. Verify that the Lower Tester does not receive an ATT_Handle_Value_Notification from the IUT
    containing the Rower Data characteristic.
- Expected Outcome

```
Pass verdict
```
```
The IUT sends one or more Data Records where each Data Record consists of one or more
notifications of the Rower Data characteristic.
```
```
The Data Records contain at least the Flags field, Stroke Rate, and the Stroke Count field are
included when the More Data bit of the Flags field is set to 0.
```
```
The value of each field of the characteristic meets the requirements of the service.
```
```
The IUT stops sending notifications of the Rower Data characteristic after the Lower Tester
configures the characteristic to disable notifications.
```
```
In all cases, ensure that the RFU bits of the Flags field are set to zero.
```
## 4.6.5 Rower Data Notifications – Supported Fields

- Test Purpose

```
This is a generic procedure to verify that the IUT can send a Data Record consisting of one or more
notifications of the Rower Data characteristic that include the supported field specified in Table 4. 10
with a valid value. The test is repeated for each Fitness Machine Feature supported by the IUT.
```
- Reference

```
See Table 4. 10.
```
- Initial Condition
    - If the IUT requires a bonding procedure, then perform a bonding procedure.
    - The Rower Data characteristic is configured for notification.
    - Establish an ATT Bearer connection between the Lower Tester and IUT as described in
       Section 4.2.1, if using an LE transport, or Section 4.2.2 if using a BR/EDR transport.
    - If IUT permissions for the Rower Data characteristic require a specific security mode or security
       level, establish a connection meeting those requirements.


- Test Case Configuration

```
Test Case Reference Included
Fields
```
```
Flags Bits Fitness Machine
Features Bit
```
## FTMS/SR/CN/BV- 45 - C [Rower Data Notifications – Average Stroke Rate Supported]

```
[4] 4.8.1.4 Average
Stroke Rate
```
```
Average Stroke
Rate Present
```
```
Cadence
Supported
```
## FTMS/SR/CN/BV- 46 - C [Rower Data Notifications – Total Distance Supported]

```
[4] 4.8.1.5 Total Distance Total Distance
Present
```
```
Total Distance
Supported
```
## FTMS/SR/CN/BV- 47 - C [Rower Data Notifications – Pace Supported]

#### [4] 4.8.1.6

#### [4] 4.8.1.7

```
Instantaneous
Pace, Average
Pace
```
```
Instantaneous
Pace Present,
Average Pace
Present
```
```
Pace Supported
```
## FTMS/SR/CN/BV- 48 - C [Rower Data Notifications – Instantaneous Power Supported]

#### [4] 4.8.1.8

#### [4] 4.8.1.9

```
Instantaneous
Power,
Average
Power
```
```
Instantaneous
Power Present,
Average Power
Present
```
```
Power
Measurement
Supported
```
## FTMS/SR/CN/BV- 49 - C [Rower Data Notifications – Resistance Level Supported]

```
[4] 4.8.1.10 Resistance
Level
```
```
Resistance
Level
```
```
Resistance Level
Supported
```
## FTMS/SR/CN/BV- 50 - C [Rower Data Notifications – Expended Energy Supported]

#### [4] 4.8.1.11

#### [4] 4.8.1.12

#### [4] 4.8.1.13

```
Total Energy,
Energy per
Hour, Energy
per Minute
```
```
Expended
Energy Present
```
```
Expended
Energy
Supported
```
## FTMS/SR/CN/BV- 51 - C [Rower Data Notifications – Heart Rate Measurement Supported]

```
[4] 4.8.1.14 Heart Rate Heart Rate
Present
```
```
Heart Rate
Measurement
Supported
```
## FTMS/SR/CN/BV- 52 - C [Rower Data Notifications – Metabolic Equivalent Supported]

```
[4] 4.8.1.15 Metabolic
Equivalent
```
```
Metabolic
Equivalent
Present
```
```
Metabolic
Equivalent
Supported
```
## FTMS/SR/CN/BV- 53 - C [Rower Data Notifications – Remaining Time Supported]

```
[4] 4.8.1.17 Remaining
Time
```
```
Remaining Time
Present
```
```
Remaining Time
Supported
```
```
Table 4. 10 : Rower Data Notifications – Supported Fields test cases
```
- Test Procedure
    1. Perform an action on the IUT that will induce it, once connected, to send a rower-related Data
       Record, which consists of one or more notifications of the Rower Data characteristic. The Data
       Record contains the Included Fields specified in Table 4. 10.
    2. A connection is established between the Lower Tester and IUT meeting the security requirements
       of the IUT, if not already done so prior to step 1.
    3. The Lower Tester reads the Fitness Machine Feature characteristic (e.g., by executing test case
       FTMS/SR/CR/BV- 01 - C [Characteristic Read – Fitness Machine Feature] or by other means).


4. The Lower Tester receives a Data Record, which consists of one or more
    ATT_Handle_Value_Notification from the IUT containing the Rower Data characteristic handle
    and value.
5. Verify that the characteristic value meets the requirements of the service.
6. Repeat steps 4–5 until the Lower Tester receives a Data Record with the Included Fields
    specified in Table 4. 10.
7. The Lower Tester configures the Rower Data characteristic to disable notifications.
- Expected Outcome

```
Pass verdict
```
```
The IUT sends one or more Data Records where each Data Record consists of one or more
notifications of the Rower Data characteristic.
```
```
The Data Records contain at least the Flags field, and the Included Fields are present when the
specified Flags Bits are set to 1.
```
```
The values for the specified Included Fields meet the requirements of the service.
```
```
The specified Fitness Machine Features Bit of the Fitness Machine Features field of the Fitness
Machine Feature characteristic is set to 1.
```
```
In all cases, ensure that the RFU bits of the Flags field are set to zero.
```
## FTMS/SR/CN/BV- 54 - C [Rower Data Notifications – Elapsed Time]

- Test Purpose

```
Verify that the IUT can send notifications of the Rower Data characteristic that include the Elapsed
Time value. Additionally, verify that when link loss occurs while the server sends a Data Record, the
Data Record is discarded and not sent to the Client if the connection is reestablished.
```
- Reference

```
[4] 4.8.1.16, 4.18
```
- Initial Condition
    - If the IUT requires a bonding procedure, then perform a bonding procedure.
    - The Rower Data characteristic is configured for notification.
    - Establish an ATT Bearer connection between the Lower Tester and IUT as described in
       Section 4.2.1, if using an LE transport, or Section 4.2.2 if using a BR/EDR transport.
    - If IUT permissions for the Rower Data characteristic require a specific security mode or security
       level, establish a connection meeting those requirements.
- Test Procedure
    1. Perform an action on the IUT that will induce it, once connected, to send rower-related Data
       Record, which consists of one or more notifications of the Rower Data characteristic along with
       the Elapsed Time field (e.g., start a training session).
    2. A connection is established between the Lower Tester and IUT meeting the security requirements
       of the IUT, if not already done so prior to step 1.
    3. The Lower Tester reads the Fitness Machine Feature characteristic (e.g. by executing test case
       FTMS/SR/CR/BV- 01 - C [Characteristic Read – Fitness Machine Feature] or by other means).


4. The Lower Tester receives a Data Record, which consists of one or more
    ATT_Handle_Value_Notification from the IUT containing the Rower Data characteristic handle
    and value.
5. Verify that the characteristic value meets the requirements of the service.
6. Repeat steps 4–5 until the Lower Tester receives a Data Record, which includes the Elapsed
    Time field.
7. The Lower Tester terminates the link between the IUT and the Lower Tester.
8. After 10 seconds, reestablish the connection between the Lower Tester and IUT meeting the
    security requirements of the IUT.
9. The Lower Tester receives Data Record, which consists of one or more
    ATT_Handle_Value_Notification from the IUT containing the Rower Data characteristic handle
    and value.
10. Verify that the characteristic value meets the requirements of the service.
11. Repeat steps 9–10 until the Lower Tester receives a Data Record, which includes the Elapsed
    Time field.
12. The Lower Tester configures the Rower Data characteristic to disable notifications.
- Expected Outcome

```
Pass verdict
```
```
The IUT sends one or more Data Records where each Data Record consists of one or more
notifications of the Rower Data characteristic.
```
```
The Data Records contain at least the Flags field, and the Elapsed Time value is included when the
Elapsed Time Present bit of the Flags field is set to 1.
```
```
The value of each field of the characteristic meets the requirements of the service.
```
```
The value of the Elapsed Time Supported bit of the Fitness Machine Feature characteristic is set to 1.
```
```
In all cases, ensure that the RFU bits of the Flags field are set to zero.
```
```
After step 8, the IUT sends one or more Data Records where each Data Record consists of one or
more notifications of the Rower Data characteristic until the Elapsed Time field is present. The
Elapsed Time value received in step 9 is at least 9 seconds later than the Elapsed Time value
received in step 4.
```
## FTMS/SR/CN/BV- 55 - C [Indoor Bike Data Notifications – Receive Complete Data Record]

- Test Purpose

```
Verify that the IUT can send notifications of the Indoor Bike Data characteristic that include the
mandatory fields (i.e., Flags, and Instantaneous Speed) when complete Data Record is received.
```
- Reference

```
[4] 4.9.1.1, 4.9.1.2, 4.8.1.3
```
- Initial Condition
    - If the IUT requires a bonding procedure, then perform a bonding procedure.
    - The Indoor Bike Data characteristic is configured for notification.
    - Establish an ATT Bearer connection between the Lower Tester and IUT as described in
       Section 4.2.1, if using an LE transport, or Section 4.2.2 if using a BR/EDR transport.
    - If IUT permissions for the Indoor Bike Data characteristic require a specific security mode or
       security level, establish a connection meeting those requirements.


- Test Procedure
    1. Perform an action on the IUT that will induce it, once connected, to send indoor bike-related Data
       Record, which consists of one or more notifications of the Indoor Bike Data characteristic along
       with the Flags field and Instantaneous Speed field.
    2. A connection is established between the Lower Tester and IUT meeting the security requirements
       of the IUT, if not already done so prior to step 1.
    3. The Lower Tester reads the Fitness Machine Feature characteristic (e.g., by executing test case
       FTMS/SR/CR/BV- 01 - C [Characteristic Read – Fitness Machine Feature] or by other means).
    4. The Lower Tester receives a Data Record, which consists of one or more
       ATT_Handle_Value_Notification from the IUT containing the Indoor Bike Data characteristic
       handle and value.
    5. Verify that the characteristic value meets the requirements of the service.
    6. The Lower Tester configures the Indoor Bike Data characteristic to disable notifications.
    7. Repeat steps 1–2 with notifications disabled.
    8. Verify that the Lower Tester does not receive an ATT_Handle_Value_Notification from the IUT
       containing the Indoor Bike Data characteristic.
- Expected Outcome

```
Pass verdict
```
```
The IUT sends one or more Data Records where each Data Record consists of one or more
notifications of the Indoor Bike Data characteristic.
```
```
The Data Records contain at least the Flags field, and Instantaneous Speed field is included when
the More Data bit of the Flags field is set to 0.
```
```
The value of each field of the characteristic meets the requirements of the service.
```
```
The IUT stops sending notifications of the Indoor Bike Data characteristic after the Lower Tester
configures the characteristic to disable notifications.
```
```
In all cases, ensure that the RFU bits of the Flags field are set to zero.
```
## 4.6.6 Indoor Bike Data Notifications – Supported Fields

- Test Purpose

```
Verify that the IUT can send a Data Record consisting of one or more notifications of the Rower Data
characteristic that include the supported field specified in Table 4. 11 with a valid value. The test is
repeated for each Fitness Machine Feature supported by the IUT.
```
- Reference

```
See Table 4. 11.
```
- Initial Condition
    - If the IUT requires a bonding procedure, then perform a bonding procedure.
    - The Indoor Bike Data characteristic is configured for notification.
    - Establish an ATT Bearer connection between the Lower Tester and IUT as described in
       Section 4.2.1, if using an LE transport, or Section 4.2.2 if using a BR/EDR transport.
    - If IUT permissions for the Indoor Bike Data characteristic require a specific security mode or
       security level, establish a connection meeting those requirements.


- Test Case Configuration

```
Test Case Reference Included Fields Flags Bits Fitness
Machine
Features Bit
```
## FTMS/SR/CN/BV- 56 - C [Indoor Bike Data Notifications – Average Speed Supported]

```
[4] 4.9.1.3 Average Speed Average Speed
Present
```
```
Average Speed
Supported
```
## FTMS/SR/CN/BV- 57 - C [Indoor Bike Data Notifications – Cadence Supported]

#### [4] 4.9.1.4

#### [4] 4.9.1.5

```
Instantaneous
Cadence,
Average
Cadence
```
```
Instantaneous
Cadence,
Average
Cadence
```
```
Cadence
Supported
```
## FTMS/SR/CN/BV- 58 - C [Indoor Bike Data Notifications – Total Distance Supported]

```
[4] 4.9.1.6 Total Distance Total Distance
Present
```
```
Total Distance
Supported
```
## FTMS/SR/CN/BV- 59 - C [Indoor Bike Data Notifications – Resistance Level Supported]

```
[4] 4.9.1.7 Resistance Level Resistance
Level Present
```
```
Resistance
Level
Supported
```
## FTMS/SR/CN/BV- 60 - C [Indoor Bike Data Notifications – Power Measurement Supported]

#### [4] 4.9.1.8

#### [4] 4.9.1.9

```
Instantaneous
Power,
Average Power
```
```
Instantaneous
Power Present,
Average Power
Present
```
```
Power
Measurement
Supported
```
## FTMS/SR/CN/BV- 61 - C [Indoor Bike Data Notifications – Expended Energy Supported]

#### [4] 4.9.1.10

#### [4] 4.9.1.11

#### [4] 4.9.1.12

```
Total Energy,
Energy per Hour,
Energy per
Minute
```
```
Expended
Energy Present
```
```
Expended
Energy
Supported
```
## FTMS/SR/CN/BV- 62 - C [Indoor Bike Data Notifications – Heart Rate Measurement Supported]

```
[4] 4.9.1.13 Heart Rate Heart Rate
Present
```
```
Heart Rate
Measurement
Supported
```
## FTMS/SR/CN/BV- 63 - C [Indoor Bike Data Notifications – Metabolic Equivalent Supported]

```
[4] 4.9.1.14 Metabolic
Equivalent
```
```
Metabolic
Equivalent
Present
```
```
Metabolic
Equivalent
Supported
```
## FTMS/SR/CN/BV- 64 - C [Indoor Bike Data Notifications – Remaining Time Supported]

```
[4] 4.9.1.16 Remaining Time Remaining
Time Present
```
```
Remaining
Time
Supported
```
```
Table 4. 11 : Indoor Bike Data Notifications – Supported Fields test cases
```
- Test Procedure
    1. Perform an action on the IUT that will induce it, once connected, to send an indoor bike-related
       Data Record, which consists of one or more notifications of the Indoor Bike Data characteristic.
       The Data Record contains the Included Fields specified in Table 4. 11.
    2. A connection is established between the Lower Tester and IUT meeting the security requirements
       of the IUT, if not already done so prior to step 1.
    3. The Lower Tester reads the Fitness Machine Feature characteristic (e.g., by executing test case
       FTMS/SR/CR/BV- 01 - C [Characteristic Read – Fitness Machine Feature] or by other means).


4. The Lower Tester receives a Data Record, which consists of one or more
    ATT_Handle_Value_Notification from the IUT containing the Indoor Bike Data characteristic
    handle and value.
5. Verify that the characteristic value meets the requirements of the service.
6. Repeat steps 4–5 until the Lower Tester receives a Data Record with the Included Fields
    specified in Table 4. 11.
7. The Lower Tester configures the Indoor Bike Data characteristic to disable notifications.
- Expected Outcome

```
Pass verdict
```
```
The IUT sends one or more Data Records where each Data Record consists of one or more
notifications of the Indoor Bike Data characteristic.
```
```
The Data Records contain at least the Flags field, and the Included Fields are present when the
specified Flags Bits are set to 1.
```
```
The values for the specified Included Fields meet the requirements of the service.
```
```
The specified Fitness Machine Features Bit of the Fitness Machine Features field of the Fitness
Machine Feature characteristic is set to 1.
```
```
In all cases, ensure that the RFU bits of the Flags field are set to zero.
```
## FTMS/SR/CN/BV- 65 - C [Indoor Bike Data Notifications – Elapsed Time]

- Test Purpose

```
Verify that the IUT can send notifications of the Indoor Bike Data characteristic that include the
Elapsed Time value. Additionally, verify that when link loss occurs while the server sends a Data
Record, the Data Record is discarded and not sent to the Client if the connection is reestablished.
```
- Reference

```
[4] 4.9.1.15, 4.18
```
- Initial Condition
    - If the IUT requires a bonding procedure, then perform a bonding procedure.
    - The Indoor Bike Data characteristic is configured for notification.
    - Establish an ATT Bearer connection between the Lower Tester and IUT as described in
       Section 4.2.1, if using an LE transport, or Section 4.2.2 if using a BR/EDR transport.
    - If IUT permissions for the Indoor Bike Data characteristic require a specific security mode or
       security level, establish a connection meeting those requirements.
- Test Procedure
    1. Perform an action on the IUT that will induce it, once connected, to send indoor bike-related Data
       Record, which consists of one or more notifications of the Indoor Bike Data characteristic along
       with the Elapsed Time field (e.g., start a training session).
    2. A connection is established between the Lower Tester and IUT meeting the security requirements
       of the IUT, if not already done so prior to step 1.
    3. The Lower Tester reads the Fitness Machine Feature characteristic (e.g., by executing test case
       FTMS/SR/CR/BV- 01 - C [Characteristic Read – Fitness Machine Feature] or by other means).


4. The Lower Tester receives a Data Record, which consists of one or more
    ATT_Handle_Value_Notification from the IUT containing the Indoor Bike Data characteristic
    handle and value.
5. Verify that the characteristic value meets the requirements of the service.
6. Repeat steps 4–5 until the Lower Tester receives a Data Record, which includes the Elapsed
    Time field.
7. The Lower Tester terminates the link between the IUT and the Lower Tester.
8. After 10 seconds, reestablish the connection between the Lower Tester and IUT meeting the
    security requirements of the IUT.
9. The Indoor Bike Data characteristic is re-configured for notification if the IUT does not support
    bonding.
10. The Lower Tester receives Data Record, which consists of one or more
    ATT_Handle_Value_Notification from the IUT containing the Indoor Bike Data characteristic
    handle and value.
11. Verify that the characteristic value meets the requirements of the service.
12. Repeat steps 10– 11 until the Lower Tester receives a Data Record, which includes the Elapsed
    Time field.
13. The Lower Tester configures the Indoor Bike Data characteristic to disable notifications.
- Expected Outcome

```
Pass verdict
```
```
The IUT sends one or more Data Records where each Data Record consists of one or more
notifications of the Indoor Bike Data characteristic.
```
```
The Data Records contain at least the Flags field, and the Elapsed Time value is included when the
Elapsed Time Present bit of the Flags field is set to 1.
```
```
The value of each field of the characteristic meets the requirements of the service.
```
```
The value of the Elapsed Time Supported bit of the Fitness Machine Feature characteristic is set to 1.
```
```
In all cases, ensure that the RFU bits of the Flags field are set to zero.
```
```
After step 9 , the IUT sends one or more Data Records where each Data Record consists of one or
more notifications of the Indoor Bike Data characteristic until the Elapsed Time field is present. The
Elapsed Time value received in step 10 is at least 9 seconds later than the Elapsed Time value
received in step 4.
```
## 4.7 Training Status Notifications

Verify that characteristic value notifications of the Training Status characteristic required by the service
are compliant.

## FTMS/SR/TSN/BV- 01 - C [Training Status Notifications]

- Test Purpose

```
Verify that the IUT can send notifications Training Status characteristic that includes the mandatory
fields (i.e., Flags and Training Status fields) when complete Data Record is received.
```
- Reference

```
[4] 4.10.1.1, 4.10.1.2
```

- Initial Condition
    - If the IUT requires a bonding procedure, then perform a bonding procedure.
    - The Training Status characteristic is configured for notification.
    - Establish an ATT Bearer connection between the Lower Tester and IUT as described in
       Section 4.2.1, if using an LE transport, or Section 4.2.2 if using a BR/EDR transport.
    - If IUT permissions for the Training Status characteristic require a specific security mode or
       security level, establish a connection meeting those requirements.
- Test Procedure
    1. Perform an action on the IUT that will induce it, once connected, to send Training Status
       characteristic along with the Flags field and Training Status field.
    2. A connection is established between the Lower Tester and IUT meeting the security requirements
       of the IUT, if not already done so prior to step 1.
    3. The Lower Tester receives one ATT_Handle_Value_Notification from the IUT containing the
       Training Status characteristic handle and value along with the Flags field and Training Status
       field.
    4. Verify that the characteristic value meets the requirements of the service.
    5. Repeat steps 1–2 with notifications disabled.
    6. Verify that the Lower Tester does not receive an ATT_Handle_Value_Notification from the IUT
       containing the Training Status characteristic.
- Expected Outcome

```
Pass verdict
```
```
The IUT sends one notification of the Training Status characteristic along with the Flags field and
Training Status field.
```
```
The Training Status characteristic contains at least the Flags field and Training Status field.
```
```
The value of each field of the characteristic meets the requirements of the service.
```
```
The IUT stops sending notifications of the Training Status characteristic after the Lower Tester
configures the characteristic to disable notifications.
```
```
In all cases, ensure that the RFU bits of the Flags field are set to zero.
```
## FTMS/SR/TSN/BV- 02 - C [Training Status Notifications – Training Status String]

- Test Purpose

```
Verify that the IUT can send notifications of the Training Status characteristic that include the Training
Status String value when complete Data Record is received.
```
- Reference

```
[4] 4.10.1.3
```
- Initial Condition
    - If the IUT requires a bonding procedure, then perform a bonding procedure.
    - The Training Status characteristic is configured for notification.


- Establish an ATT Bearer connection between the Lower Tester and IUT as described in
    Section 4.2.1, if using an LE transport, or Section 4.2.2 if using a BR/EDR transport.
- If IUT permissions for the Training Status characteristic require a specific security mode or
    security level, establish a connection meeting those requirements.
- Test Procedure
1. Perform an action on the IUT that will induce it, once connected, to send Training Status String
characteristic along with the Training Status String field.
2. A connection is established between the Lower Tester and IUT meeting the security requirements
of the IUT, if not already done so prior to step 1.
3. The Lower Tester receives one ATT_Handle_Value_Notification from the IUT containing the
Training Status characteristic handle and value along with the Training Status String field.
4. Verify that the characteristic value meets the requirements of the service.
5. The Lower Tester configures the Training Status characteristic to disable notifications.
- Expected Outcome

```
Pass verdict
```
```
The IUT sends one notification of the Training Status characteristic, which includes the Training
Status String value with the appropriate flag set in the Flags field.
```
```
The value of each field of the characteristic meets the requirements of the service.
```
```
The value of the Training Status String Supported bit of the Fitness Machine Feature characteristic is
set to 1.
```
```
In all cases, ensure that the RFU bits of the Flags field are set to zero.
```
## FTMS/SR/TSN/BV- 03 - C [Training Status Notifications – Training Status Extended String]

- Test Purpose

```
Verify that the IUT can send notifications of the Training Status characteristic when the characteristic
exceeds the current MTU size due to a large Training Status String value.
```
- Reference

```
[4] 4.10.1.3
```
- Initial Condition
    - If the IUT requires a bonding procedure, then perform a bonding procedure.
    - The Training Status characteristic is configured for notification.
    - The Training Status characteristic size exceeds the current MTU size. The IXIT specifies a value
       of the Training Status String field that exceeds the negotiated MTU size minus 5 octets.
    - Establish an ATT Bearer connection between the Lower Tester and IUT as described in
       Section 4.2.1, if using an LE transport, or Section 4.2.2 if using a BR/EDR transport.
    - If IUT permissions for the Training Status characteristic require a specific security mode or
       security level, establish a connection meeting those requirements.


- Test Procedure
    1. Perform an action on the IUT that will induce it, once connected, to send Training Status String
       characteristic along with the Training Status String field.
    2. A connection is established between the Lower Tester and IUT meeting the security requirements
       of the IUT, if not already done so prior to step 1.
    3. The Lower Tester receives one ATT_Handle_Value_Notification from the IUT containing the
       Training Status characteristic handle and value. In the Flags field of the characteristic, the
       Training Status String present bit is set to 1, the Extended String present bit is set to 1, and the
       Training Status String field is present.
    4. Read the characteristic value by executing the GATT Read Long Characteristic Values sub-
       procedure.
    5. Verify that the characteristic value meets the requirements of the service.
    6. The Lower Tester configures the Training Status characteristic to disable notifications.
- Expected Outcome

```
Pass verdict
```
```
The IUT sends one notification of the Training Status characteristic, which includes the Training
Status String value with the Training Status String present and Extended String present flags set in
the Flags field.
```
```
The value of each field of the characteristic meets the requirements of the service.
```
```
The value of the Training Status String Supported bit of the Fitness Machine Feature characteristic is
set to 1.
```
```
In all cases, ensure that the RFU bits of the Flags field are set to zero.
```
## 4.8 Fitness Machine Status Notifications

- Test Purpose

```
Verify that characteristic value notifications of the Fitness Machine Status characteristic required by
the service are compliant. The verification is done for each supported characteristic value notification,
as enumerated in the test cases in Table 4. 12 , using this generic test procedure.
```
- Reference

```
[4] 4.1 7
```
- Initial Condition
    - The handle of each characteristic value referenced in the test cases below has been previously
       discovered by the Lower Tester during the test procedure in Section 4.3 or is known to the Lower
       Tester by other means.
    - If the IUT requires a bonding procedure, then perform a bonding procedure.
    - Establish an ATT Bearer connection between the Lower Tester and IUT as described in
       Section 4.2.1, if using an LE transport, or Section 4.2.2 if using a BR/EDR transport.
    - If IUT permissions for the characteristic require a specific security mode or security level,
       establish a connection meeting those requirements.


- Test Case Configuration

```
Test Case Op Code
(Requirements)
```
```
Parameter
```
## FTMS/SR/FMSN/BV- 01 - C [Fitness Machine Status Notifications - Reset]

```
Reset (0x01) N/A
```
## FTMS/SR/FMSN/BV- 02 - C [Fitness Machine Status Notifications – Fitness Machine Stopped by the User]

```
Fitness Machine
Stopped by the User
(0x02)
```
```
0x01
```
## FTMS/SR/FMSN/BV- 03 - C [Fitness Machine Status Notifications – Fitness Machine Paused by the User]

```
Fitness Machine
Paused by the User
(0x02)
```
```
0x02
```
```
FTMS/SR/FMSN/BV- 04 - C [Fitness
Machine Status Notifications – Fitness
Machine Stopped by the Safety Key]
```
```
Fitness Machine
Stopped by Safety Key
(0x03)
```
#### N/A

```
FTMS/SR/FMSN/BV- 05 - C [Fitness
Machine Status Notifications – Fitness
Machine Started or Resumed by the
User]
```
```
Fitness Machine
Started or Resumed by
the User (0x04)
```
#### N/A

## FTMS/SR/FMSN/BV- 06 - C [Fitness Machine Status Notifications – Target Speed Changed]

```
Target Speed Changed
(0x05)
```
```
New Target Value (UINT16 in
kilometer per hour with a
resolution 0.01 km/h)
e.g., 50 km/h
```
## FTMS/SR/FMSN/BV- 07 - C [Fitness Machine Status Notifications – Target Incline Changed]

```
Target Incline Changed
(0x06)
```
```
New Target Value (SINT16 in
% with a resolution of 0.1 %)
e.g., +1.0 %
FTMS/SR/FMSN/BV- 08 - C [Fitness
Machine Status Notifications – Target
Resistance Level Changed – UINT8]
```
```
Target Resistance
Level Changed (0x07)
```
```
New Target Value (UINT8,
unitless with a resolution of
0.1) e.g., 5.0
FTMS/SR/FMSN/BV- 25 - C [Fitness
Machine Status Notifications – Target
Resistance Level Changed – SINT16]
```
```
Target Resistance
Level Changed (0x07)
```
```
New Target Value (SINT16,
unitless with a resolution of
0.1) e.g., 5.0
```
## FTMS/SR/FMSN/BV- 09 - C [Fitness Machine Status Notifications – Target Power Changed]

```
Target Power Changed
(0x08)
```
```
New Target Power (SINT16,
in Watt with a resolution of 1)
e.g., +100W
```
## FTMS/SR/FMSN/BV- 10 - C [Fitness Machine Status Notifications – Target Heart Rate Changed]

```
Target Heart Rate
Changed (0x09)
```
```
New Target Heart Rate
(UINT8, in BPM with a
resolution of 1) e.g., 135 bpm
```
## FTMS/SR/FMSN/BV- 11 - C [Fitness Machine Status Notifications – Targeted Expended Energy Changed]

```
Targeted Expended
Energy Changed
(0x0A)
```
```
New Targeted Expended
Energy (UINT16, in Calories
with a resolution of 1) e.g.,
500 calories
```
## FTMS/SR/FMSN/BV- 12 - C [Fitness Machine Status Notifications – Targeted Number of Steps Changed]

```
Targeted Number of
Steps Changed (0x0B)
```
```
New Targeted Number of
Steps Value (UINT16, in
Steps with a resolution of 1)
e.g., 2000 steps
```
## FTMS/SR/FMSN/BV- 13 - C [Fitness Machine Status Notifications – Targeted Number of Strides Changed]

```
Targeted Number of
Strides Changed
(0x0C)
```
```
New Targeted Number of
Strides (UINT16, in Stride
with a resolution of 1) e.g.,
2000 strides
```

Test Case Op Code
(Requirements)

```
Parameter
```
## FTMS/SR/FMSN/BV- 14 - C [Fitness Machine Status Notifications – Targeted Distance Changed]

```
Targeted Distance
Changed (0x0D)
```
```
New Targeted Distance
(UINT24, in Meters with a
resolution of 1) e.g., 5000 m
```
## FTMS/SR/FMSN/BV- 15 - C [Fitness Machine Status Notifications – Targeted Training Time Changed]

```
Targeted Training Time
Changed (0x0E)
```
```
New Targeted Training Time
(UINT16, in Seconds with a
resolution of 1) e.g., 3600 s
```
FTMS/SR/FMSN/BV- 16 - C [Fitness
Machine Status Notifications – Targeted
Training Time in Two Heart Rate Zones
Changed]

```
Targeted Time In Two
Heart Rate Zones
Changed (0x0F)
```
```
New Targeted Time Array
with Targeted Time in Fat
Burn Zone and Targeted
Time in Fitness Zone (both
UINT16, in Seconds)
e.g., Targeted Time in Fat
Burn Zone: 1800 s
Targeted Time in Fitness
Zone: 1800 s
```
FTMS/SR/FMSN/BV- 17 - C [Fitness
Machine Status Notifications – Targeted
Training Time in Three Heart Rate
Zones Changed]

```
Targeted Time In Three
Heart Rate Zones
Changed (0x10)
```
```
New Targeted Time Array
with Targeted Time in Light
Zone and Targeted Time in
Moderate Zone and Targeted
time in Hard Zone (all
UINT16, in Seconds) e.g.,
Targeted Time in Light Zone:
500 s
Targeted Time in Moderate
Zone: 600 s
Targeted Time in Hard Zone:
1800 s
```
FTMS/SR/FMSN/BV- 18 - C [Fitness
Machine Status Notifications – Targeted
Training Time in Five Heart Rate Zones
Changed]

```
Targeted Time In Five
Heart Rate Zones
Changed (0x011)
```
```
New Targeted Time Array
with Targeted Time in Very
Light Zone, Targeted Time in
Light Zone, Targeted Time in
Moderate Zone, Targeted
Time in Hard Zone, and
Targeted Time in Maximum
Zone (all UINT16, in
Seconds)
e.g., Targeted Time in Very
Light Zone: 600 s, Targeted
Time in Light Zone: 1200 s,
Targeted Time in Moderate
Zone: 1200 s, Targeted Time
in Hard Zone: 600 s,
Targeted Time in Maximum
Zone: 300 s
```

```
Test Case Op Code
(Requirements)
```
```
Parameter
```
```
FTMS/SR/FMSN/BV- 19 - C [Fitness
Machine Status Notifications – Indoor
Bike Simulation Parameters Changed]
```
```
Indoor Bike Simulation
Parameters Changed
(0x12)
```
```
New Indoor Bike Simulation
Parameters with Wind Speed
(SINT16 in Meters per
Second with a resolution of
0.001) and Grade (SINT16 in
Percentage with a resolution
of 0.01) and Coefficient of
Rolling Resistance (UINT8
unitless with a resolution of
0.0001) and Wind Resistance
Coefficient in Kilogram per
Meter with a resolution of
0.01) e.g., Simulation
Parameter Array:
Wind Speed: 10 mps
Grade: 5%, Crr: 1, Cw: 1
kg/m
```
## FTMS/SR/FMSN/BV- 20 - C [Fitness Machine Status Notifications – Wheel Circumference Changed]

```
Wheel Circumference
Changed (0x13)
```
```
New Wheel Circumference
(UINT16, in Millimeters with
resolution of 0.1 Millimeter)
e.g., 20.0 mm
```
## FTMS/SR/FMSN/BV- 21 - C [Fitness Machine Status Notifications – Spin Down Status - Request]

```
Spin Down Status
(0x14)
```
```
Any value from 0x01 to 0x04
```
```
FTMS/SR/FMSN/BV- 22 - C [Fitness
Machine Status Notifications – Targeted
Cadence Changed Status - Request]
```
```
Targeted Cadence
Changed (0x15)
```
```
New Targeted Cadence
(UINT16, in 1/minute with a
resolution of 0.5) e.g., 100
1/minute (with a resolution of
0.5 1/minute)
```
```
Table 4. 12 : Fitness Machine Status Characteristic Notification test cases
```
- Test Procedure
    1. Perform an action on the IUT (e.g., via its UI or any other means) that will induce the sending of
       the Fitness Machine Status notification with the Op Code and Parameter specified in Table 4. 12.
    2. Verify that the characteristic value meets the requirements of the service.
- Expected Outcome

```
Pass verdict
```
```
The IUT sends a notification containing the expected Op Code and valid Parameter values. The
Parameter value sent by the IUT is verified by the Lower Tester and confirmed by the user.
```
## FTMS/SR/FMSN/BV- 23 - C [Fitness Machine Status Notifications – Control Permission Lost]

- Test Purpose

```
Verify that the IUT sends a Fitness Machine Status notification with the value set to Control
Permission Lost when the control permission is revoked by the IUT.
```
- Reference

```
[4] 4. 17
```

- Initial Condition
    - The handle of the characteristic value referenced in the test case has been previously discovered
       by the Lower Tester during the test procedure in Section 4.3 or is known to the Lower Tester by
       other means.
    - If the IUT requires a bonding procedure, then perform a bonding procedure.
    - Establish an ATT Bearer connection between the Lower Tester and IUT as described in
       Section 4.2.1, if using an LE transport, or Section 4.2.2 if using a BR/EDR transport.
    - If IUT permissions for the characteristic require a specific security mode or security level,
       establish a connection meeting those requirements.
    - Lower Tester is acting as client.
- Test Procedure
    1. Lower Tester establishes control permission with the IUT by performing the Request Control
       Procedure with the IUT (e.g., by executing test case FTMS/SR/CW/BV- 01 - C [Fitness Machine
       Control Point – Request Control Procedure]).
    2. While Lower Tester has control permission, the Upper Tester performs an action to revoke the
       control permission of the Lower Tester (e.g., by pressing a button on the UI of the IUT).
    3. Lower Tester receives a Fitness Machine Status notification from the IUT with the Op Code of
       0xFF (“Control Permission Lost”) and no additional parameters.
    4. Verify that the characteristic value meets the requirements of the service.
- Expected Outcome

```
Pass verdict
```
```
The IUT sends a Fitness Machine Status notification with the Op Code of 0xFF after Lower Tester
successfully performs the Request Control Procedure with the IUT.
```
## FTMS/SR/FMSN/BV- 24 - C [Fitness Machine Status Notifications – Multiple Clients]

- Test Purpose

```
Verify that the IUT sends a Fitness Machine Status notification to the other connected Clients with the
appropriate value when a connected Client performs an action on the IUT.
```
- Reference

```
[4] 4. 17
```
- Initial Condition

```
This Test Case requires two Lower Testers: Lower Tester 1 and Lower Tester 2.
```
- The handle of the characteristic value referenced in the test case has been previously discovered
    by the Lower Testers during the test procedure in Section 4.3 or is known to the Lower Testers by
    other means.
- If the IUT requires a bonding procedure, then perform a bonding procedure.
- Establish an ATT Bearer connection between the Lower Testers and IUT as described in
    Section 4.2.1, if using an LE transport, or Section 4.2.2 if using a BR/EDR transport.
- If IUT permissions for the characteristic require a specific security mode or security level,
    establish a connection meeting those requirements.
- Lower Testers are acting as client.


- Test Procedure
    1. Lower Tester 1 establishes a connection with the IUT and preforms the Request Control
       Procedure with the IUT (e.g., by executing test case FTMS/SR/CW/BV- 01 - C [Fitness Machine
       Control Point – Request Control Procedure]).
    2. Lower Tester 1 reads the Fitness Machine Features characteristic (e.g., by executing the test
       case FTMS/SR/CR/BV- 01 - C [Characteristic Read – Fitness Machine Feature]).
    3. Lower Tester 2 establishes a connection with the IUT and enables the notifications of the Fitness
       Machine Status characteristic.
    4. The Lower Tester 1 has control permission and performs one of the supported control procedure
       (e.g., if the Targeted Distance Configuration feature is supported, then the Set Targeted Distance
       procedure should be used).
    5. Lower Tester 2 receives a Fitness Machine Status notification from the IUT with the appropriate
       Op Code and parameter, if any.
    6. Verify that the characteristic value meets the requirements of the service.
- Expected Outcome

```
Pass verdict
```
```
The IUT sends a Fitness Machine Status notification with the expected Op Code to Lower Tester 2
(e.g., Targeted Speed Changed with the expected New Target Value).
```
## 4.9 Characteristic Write.....................................................................................................................

Verify compliant operation when the Lower Tester uses Fitness Machine Control Point to set operations.

## FTMS/SR/CW/BV- 01 - C [Fitness Machine Control Point – Request Control Procedure]

- Test Purpose

```
Verify that the IUT can accept a Fitness Machine Control Point write characteristic with Request
Control Procedure Op Code and will notify with the resulting Op Code.
```
- Reference

```
[4] 4.16.2.1
```
- Initial Condition
    - Perform the preamble described in Section 4.2.3.
- Test Procedure
    1. A connection is established between the Lower Tester and IUT.
    2. The Lower Tester reads the Fitness Machine Feature characteristic (e.g., by executing test case
       FTMS/SR/CR/BV- 01 - C [Characteristic Read – Fitness Machine Feature] or by other means).
    3. The Lower Tester writes the Request Control Procedure Op Code (0x00) to the Fitness Machine
       Control Point with no additional parameters.
    4. The IUT sends an indication of the Fitness Machine Control Point characteristic with the
       Response Code Op Code (0x80), a Parameter Value representing Request Op Code (0x00)
       followed by the Result Code for ‘Success’ (0x01) without Response Parameter.
    5. The Lower Tester receives an ATT_Handle_Value_Indication from the IUT containing the Fitness
       Machine Control Point characteristic handle and value.
    6. The Lower Tester sends an ATT_Handle_Value_Confirmation to the IUT.
    7. Verify that the characteristic value meets the requirements of the service.


- Expected Outcome

```
Pass verdict
```
```
The IUT sends one indication of the Fitness Machine Control Point characteristic with the Response
Code Op Code containing a valid Parameter Value.
```
## 4.9.1 Fitness Machine Control Point Procedures

- Test Purpose

```
Verify that the IUT can accept a Fitness Machine Control Point write characteristic with the specified
Op Code and will notify with the resulting Op Code. This test procedure is to be repeated for all rows
in Table 4. 13.
```
- Reference

```
See Table 4. 13.
```
- Initial Condition
    - Perform the preamble described in Section 4.2.3.
    - For test cases that require a stopping or pausing procedure a connection is established by the
       Lower Tester and a training session is started.
    - For test cases that require a resuming procedure, a connection is established by the Lower
       Tester and a training session is started and paused.
- Test Case Configuration

```
Test Case Reference Op
Code
```
```
Op Code
Parameter
Value
```
```
Target Setting
Features Bit (bit
number)
```
## FTMS/SR/CW/BV- 02 - C [Fitness Machine Control Point – Reset Procedure]

```
[4] 4.16.2.2 0x01 N/A N/A
```
## FTMS/SR/CW/BV- 03 - C [Fitness Machine Control Point – Set Target Speed Procedure]

```
[4] 4.16.2.3 0x02 UINT16 value Speed Target Setting
Supported (0)
```
## FTMS/SR/CW/BV- 04 - C [Fitness Machine Control Point – Set Target Inclination Procedure]

```
[4] 4.16.2.4 0x03 SINT16 value Inclination Target
Setting Supported (1)
```
## FTMS/SR/CW/BV- 05 - C [Fitness Machine Control Point – Set Target Resistance Level Procedure]

```
[4] 4.16.2.5 0x04 SINT16 value Resistance Target
Setting Supported (2)
```
## FTMS/SR/CW/BV- 06 - C [Fitness Machine Control Point – Set Target Power Procedure]

```
[4] 4.16.2.6 0x05 SINT16 value Power Target Setting
Supported (3)
```
## FTMS/SR/CW/BV- 07 - C [Fitness Machine Control Point – Set Target Heart Rate Procedure]

```
[4] 4.16.2.7 0x06 UINT8 value Heart Rate Target
Setting Supported (4)
```

Test Case Reference Op
Code

```
Op Code
Parameter
Value
```
```
Target Setting
Features Bit (bit
number)
```
## FTMS/SR/CW/BV- 08 - C [Fitness Machine Control Point – Start or Resume Procedure]

```
[4] 4.16.2.8 0x07 N/A N/A
```
## FTMS/SR/CW/BV- 09 - C [Fitness Machine Control Point – Stop Procedure]

```
[4] 4.16.2.9 0x08 0x01 N/A
```
## FTMS/SR/CW/BV- 10 - C [Fitness Machine Control Point – Pause Procedure]

```
[4] 4.16.2.9 0x08 0x02 N/A
```
## FTMS/SR/CW/BV- 11 - C [Fitness Machine Control Point – Set Targeted Expended Energy Procedure]

```
[4] 4.16.2.10 0x09 UINT16 Targeted Expended
Energy Configuration
Supported (5)
```
## FTMS/SR/CW/BV- 12 - C [Fitness Machine Control Point – Set Targeted Number of Steps Procedure]

```
[4] 4.16.2.11 0x0A UINT16 value Targeted Step
Number
Configuration
Supported (6)
```
## FTMS/SR/CW/BV- 13 - C [Fitness Machine Control Point – Set Targeted Number of Strides Procedure]

```
[4] 4.16.2.12 0X0B UINT16 value Targeted Stride
Number
Configuration
Supported (7)
```
## FTMS/SR/CW/BV- 14 - C [Fitness Machine Control Point – Set Targeted Distance Procedure]

```
[4] 4.16.2.13 0x0C UINT24 value Targeted Distance
Configuration
Supported (8)
```
## FTMS/SR/CW/BV- 15 - C [Fitness Machine Control Point – Set Targeted Training Time Procedure]

```
[4] 4.16.2.14 0x0D UINT16 value Targeted Training
Time Configuration
Supported (9)
```
#### FTMS/SR/CW/BV- 16 - C

[Fitness Machine Control
Point – Set Targeted Time in
Two Heart Rate Zones
Procedure]

```
[4] 4.16.2.15 0x0E Targeted Time
Array (as
described in [4]
4.16.2.15)
```
```
Targeted Time In
Two Heart Rate
Zones Configuration
Supported (10)
```
#### FTMS/SR/CW/BV- 17 - C

[Fitness Machine Control
Point – Set Targeted Time in
Three Heart Rate Zones
Procedure]

```
[4] 4.16.2.16 0x0F Targeted Time
Array (as
described in [4]
4.16.2.16)
```
```
Targeted Time In
Three Heart Rate
Zones Configuration
Supported (11)
```
#### FTMS/SR/CW/BV- 18 - C

[Fitness Machine Control
Point – Set Targeted Time in
Five Heart Rate Zones
Procedure]

```
[4] 4.16.2.17 0x10 Targeted Time
Array (as
described in [4]
4.16.2.17)
```
```
Targeted Time In
Five Heart Rate
Zones Configuration
Supported (12)
```
## FTMS/SR/CW/BV- 19 - C [Fitness Machine Control Point – Set Indoor Bike Simulation Parameters Procedure]

```
[4] 4.16.2.18 0x11 Simulation
Parameter
Array (as
described in [4]
4.16.2.18)
```
```
Indoor Bike
Simulation
Parameters
Supported (13)
```

```
Test Case Reference Op
Code
```
```
Op Code
Parameter
Value
```
```
Target Setting
Features Bit (bit
number)
```
## FTMS/SR/CW/BV- 20 - C [Fitness Machine Control Point – Set Wheel Circumference Procedure]

```
[4] 4.16.2.19 0x12 UINT16 value Wheel Circumference
Configuration
Supported (14)
```
## FTMS/SR/CW/BV- 21 - C [Fitness Machine Control Point – Spin Down Control Procedure]

```
[4] 4.16.2.20 0x13 0x01 or 0x02 Spin Down Control
Supported (15)
```
## FTMS/SR/CW/BV- 22 - C [Fitness Machine Control Point – Set Targeted Cadence]

```
[4] 4.16.2.21 0x14 UINT16 value Targeted Cadence
Configuration
Supported (16)
```
```
Table 4. 13 : Fitness Machine Control Point Procedures test cases
```
- Test Procedure
    1. A connection is established or has already been established between the Lower Tester and IUT.
    2. The Lower Tester reads the Fitness Machine Feature characteristic (e.g., by executing test case
       FTMS/SR/CR/BV- 01 - C [Characteristic Read – Fitness Machine Feature] or by other means).
    3. The Lower Tester requests the control of the IUT by executing the test procedure of the test case
       FTMS/SR/CW/BV- 01 - C [Fitness Machine Control Point – Request Control Procedure].
    4. The Lower Tester writes the Op Code specified in the Op Code column from Table 4. 13 to the
       Fitness Machine Control Point with additional parameter values of the type specified by the Op
       Code Parameter Value column.
    5. The IUT sends an indication of the Fitness Machine Control Point characteristic with the
       Response Code Op Code (0x80), a Parameter Value representing Request Op Code equal to the
       value of the Op Code sent in step 3 followed by the Result Code for ‘Success’ (0x01) without
       Response Parameter.
    6. The Lower Tester receives an ATT_Handle_Value_Indication from the IUT containing the Fitness
       Machine Control Point characteristic handle and value.
    7. The Lower Tester sends an ATT_Handle_Value_Confirmation to the IUT.
    8. Verify that the characteristic value meets the requirements of the service.
- Expected Outcome

```
Pass verdict
```
```
The IUT sends one indication of the Fitness Machine Control Point characteristic with a Result Code
set to Success in response to the Request Control procedure executed in step 2.
```
```
The IUT sends one indication of the Fitness Machine Control Point characteristic with the Response
Code Op Code containing a valid Parameter Value in response to the procedure executed in step 4.
```
```
The specified Target Setting Features Bit of the Target Setting Features field of the Fitness Machine
Feature characteristic is set to 1.
```

## 4.10 Service Procedure – Error Handling

Verify compliant operation in response to characteristic writes that are expected to generate error
conditions.

## FTMS/SR/SPE/BV- 01 - C [Fitness Machine Control Point – Invalid Start or Resume Procedure]

- Test Purpose

```
Verify that the IUT will respond with an “Operation Failed” Result Code when receiving a Start or
Resume Op Code after correctly responding to a previously received Start or Resume Op Code.
```
- Reference

```
[4] 4.16.2.21
```
- Initial Condition
    - Perform the preamble described in Section 4.2.3.
- Test Procedure
    1. A connection is established between the Lower Tester and IUT.
    2. The Lower Tester requests the control of the IUT by executing the test procedure of the test case
       FTMS/SR/CW/BV- 01 - C [Fitness Machine Control Point – Request Control Procedure].
    3. The Lower Tester writes the Start or Resume Op Code (0x07) to the Fitness Machine Control
       Point with no additional parameters.
    4. The IUT sends an indication of the Fitness Machine Control Point characteristic with the
       Response Code Op Code (0x80), a Parameter Value representing Request Op Code (0x07)
       followed by the Result Code for ‘Success’ (0x01) without any following Response Parameters.
    5. The Lower Tester receives an ATT_Handle_Value_Indication from the IUT containing the Fitness
       Machine Control Point characteristic handle and value.
    6. The Lower Tester sends an ATT_Handle_Value_Confirmation to the IUT.
    7. The Lower Test writes the Start or Resume Op Code (0x07) to the Fitness Machine Control Point
       with no additional Parameters.
    8. The IUT sends an indication of the Fitness Machine Control Point characteristic with the
       Response Code Op Code (0x80), a Parameter Value representing Request Op Code (0x07)
       followed by the Result Code for ‘Operation Failed’ (0x04) without any following Response
       Parameters.
    9. The Lower Tester receives an ATT_Handle_Value_Indication from the IUT containing the Fitness
       Machine Control Point characteristic handle and value.
    10. The Lower Tester sends an ATT_Handle_Value_Confirmation to the IUT.
    11. Verify that the characteristic value meets the requirements of the service.
- Expected Outcome

```
Pass verdict
```
```
The IUT sends one indication of the Fitness Machine Control Point characteristic with a Result Code
set to Success in response to the Request Control procedure executed in step 3.
```
```
The IUT sends two indications of the Fitness Machine Control Point characteristic with the Response
Code Op Code containing a valid Parameter Value for steps 5 and 9.
```
```
The second indication contains the Result Code for “Operation Failed” (0x04).
```

## FTMS/SR/SPE/BV- 02 - C [Fitness Machine Control Point – Invalid Stop or Pause Procedure]

- Test Purpose

```
Verify that the IUT will respond with an “Operation Failed” Result Code when receiving a Stop or
Pause Op Code after correctly responding to a previously received Stop or Pause Op Code.
```
- Reference

```
[4] 4.16.2.21
```
- Initial Condition
    - Perform the preamble described in Section 4.2.3.
- Test Procedure
    1. A connection is established between the Lower Tester and IUT.
    2. The Lower Tester requests the control of the IUT by executing the test procedure of the test case
       FTMS/SR/CW/BV- 01 - C [Fitness Machine Control Point – Request Control Procedure].
    3. The Lower Tester writes the Start or Resume Op Code (0x0 7 ) to the Fitness Machine Control
       Point.
    4. The IUT sends an indication of the Fitness Machine Control Point characteristic with the
       Response Code Op Code (0x80), a Parameter Value representing Request Op Code (0x07)
       followed by the Result Code for ‘Success’ (0x01) without any following Response Parameters.
    5. The Lower Tester writes the Stop or Pause Op Code (0x08) to the Fitness Machine Control Point
       with a Control Information Parameter value of 0x01 (“Stop”).
    6. The IUT sends an indication of the Fitness Machine Control Point characteristic with the
       Response Code Op Code (0x80), a Parameter Value representing Request Op Code (0x08)
       followed by the Result Code for ‘Success’ (0x01) without any following Response Parameters.
    7. The Lower Tester receives an ATT_Handle_Value_Indication from the IUT containing the Fitness
       Machine Control Point characteristic handle and value.
    8. The Lower Tester sends an ATT_Handle_Value_Confirmation to the IUT.
    9. The Lower Test writes the Stop or Pause Op Code (0x08) to the Fitness Machine Control Point
       with a Control Information Parameter value of 0x01 (“Stop”).
    10. The IUT sends an indication of the Fitness Machine Control Point characteristic with the
       Response Code Op Code (0x80), a Parameter Value representing Request Op Code (0x08)
       followed by the Result Code for ‘Operation Failed’ (0x04) without any following Response
       Parameters.
    11. The Lower Tester receives an ATT_Handle_Value_Indication from the IUT containing the Fitness
       Machine Control Point characteristic handle and value.
    12. The Lower Tester sends an ATT_Handle_Value_Confirmation to the IUT.
    13. Verify that the characteristic value meets the requirements of the service.
- Expected Outcome

```
Pass verdict
```
```
The IUT sends one indication of the Fitness Machine Control Point characteristic with a Result Code
set to Success in response to the Request Control procedure executed in step 3.
```
```
The IUT sends three indications of the Fitness Machine Control Point characteristic with the
Response Code Op Code containing a valid Parameter Value for steps 5 and 9.
```
```
The second indication received in step 12 contains the Result Code for ‘Operation Failed’ (0x04).
```

## FTMS/SR/SPE/BV- 03 - C [Fitness Machine Control Point – Unsupported Op Code]

- Test Purpose

```
Verify that the IUT will respond with the correct response Op Code.
```
- Reference

```
[4] 4.16.2.21
```
- Initial Condition
    - Perform the preamble described in Section 4.2.3.
- Test Procedure
    1. A connection is established between the Lower Tester and IUT.
    2. The Lower Tester writes an unsupported Op Code of (0x81) to the Fitness Machine Control Point
       with no additional parameters.
    3. The IUT sends an indication of the Fitness Machine Control Point characteristic with the
       Response Code Op Code (0x80), a Parameter Value representing Request Op Code (0x81)
       followed by the Result Code for ‘op code not supported’ (0x02) without any following Response
       Parameters.
    4. The Lower Tester receives an ATT_Handle_Value_Indication from the IUT containing the Fitness
       Machine Control Point characteristic handle and value.
    5. The Lower Tester sends an ATT_Handle_Value_Confirmation to the IUT.
    6. Verify that the characteristic value meets the requirements of the service.
- Expected Outcome

```
Pass verdict
```
```
The IUT sends one indication of the Fitness Machine Control Point characteristic with the Response
Code Op Code containing a valid Parameter Value.
```
```
The indication contains the Result Code for ‘Op Code Not Supported’ (0x02).
```
## Procedure] FTMS/SR/SPE/BV- 04 - C [Fitness Machine Control Point – Out of Range Parameter Set Target Speed

Target Speed Procedure]

- Test Purpose

```
Verify that the IUT will respond with the correct response Op Code.
```
- Reference

```
[4] 4.16.2.21
```
- Initial Condition
    - Perform the preamble described in Section 4.2.3.
- Test Procedure
    1. A connection is established between the Lower Tester and IUT.
    2. The Lower Tester reads the Supported Speed Range characteristic (e.g., by executing test case
       FTMS/SR/CR/BV- 03 - C [Characteristic Read – Supported Speed Range] or by other means).
    3. The Lower Tester requests the control of the IUT by executing the test procedure of the test case
       FTMS/SR/CW/BV- 01 - C [Fitness Machine Control Point – Request Control Procedure].


4. The Lower Tester writes the Set Target Speed Procedure Op Code (0x02) to the Fitness Machine
    Control Point with a value that is greater than the Maximum Speed Field of the Supported Speed
    Range characteristic found in the previous step.
5. The IUT sends an indication of the Fitness Machine Control Point characteristic with the
    Response Code Op Code (0x80), a Parameter Value representing Request Op Code (0x02)
    followed by the Result Code for ‘Invalid Parameter’ (0x03) without any following Response
    Parameters.
6. The Lower Tester receives an ATT_Handle_Value_Indication from the IUT containing the Fitness
    Machine Control Point characteristic handle and value.
7. The Lower Tester sends an ATT_Handle_Value_Confirmation to the IUT.
8. Verify that the characteristic value meets the requirements of the service.
9. The Lower Tester writes the Set Target Speed Procedure Op Code (0x02) to the Fitness Machine
    Control Point with a value that is larger than the Maximum Speed Field of the Supported Speed
    Range characteristic found in the previous step.
10. The IUT sends an indication of the Fitness Machine Control Point characteristic with the
    Response Code Op Code (0x80), a Parameter Value representing Request Op Code (0x02)
    followed by the Result Code for ‘Invalid Parameter’ (0x03) without any following Response
    Parameters.
11. The Lower Tester receives an ATT_Handle_Value_Indication from the IUT containing the Fitness
    Machine Control Point characteristic handle and value.
12. The Lower Tester sends an ATT_Handle_Value_Confirmation to the IUT.
13. Verify that the characteristic value meets the requirements of the service.
- Expected Outcome

```
Pass verdict
```
```
Steps 1– 8 :
```
```
The IUT sends one indication of the Fitness Machine Control Point characteristic with a Result Code
set to Success in response to the Request Control procedure executed in step 4.
```
```
The IUT sends one indication of the Fitness Machine Control Point characteristic with the Response
Code Op Code containing a valid Parameter Value in response to the Set Target Speed procedure
executed in step 5.
```
```
The indication contains the Result Code for ‘Invalid Parameter’ (0x03).
```
```
Steps 9 – 13 :
```
```
The IUT sends one indication of the Fitness Machine Control Point characteristic with the Response
Code Op Code containing a valid Parameter Value in response to the Set Target Speed procedure
executed in step 10.
```
```
The indication contains the Result Code for ‘Invalid Parameter’ (0x03).
```
## Procedure] FTMS/SR/SPE/BI- 05 - C [Fitness Machine Control Point – Out of Range Parameter Set Target Inclination

Target Inclination Procedure]

- Test Purpose

```
Verify that the IUT will respond with the correct response Op Code.
```
- Reference

```
[4] 4.16.2.4, 4.16.2.22
```

- Initial Condition
    - Perform the preamble described in Section 4.2.3.
- Test Procedure
    1. A connection is established between the Lower Tester and IUT.
    2. The Lower Tester reads the Supported Inclination Range characteristic (e.g. by executing test
       case FTMS/SR/CR/BV- 04 - C [Characteristic Read – Supported Inclination Range] or by other
       means).
    3. The Lower Tester requests the control of the IUT by executing the test procedure of the test case
       FTMS/SR/CW/BV- 01 - C [Fitness Machine Control Point – Request Control Procedure].
    4. Alternative 1:
       - The Lower Tester writes the Set Target Inclination Procedure Op Code (0x03) to the Fitness
          Machine Control Point with a value that is smaller than the Minimum Inclination Field value of
          the Supported Inclination Range characteristic found in step 2.

```
Alternative 2:
```
- If the IUT supports the minimum value defined of the range, the Lower Tester writes the Set
    Target Inclination Procedure Op Code (0x03) to the Fitness Machine Control Point with the
    Minimum Inclination Field value of the Supported Inclination Range characteristic.
5. The IUT sends an indication of the Fitness Machine Control Point characteristic with the
Response Code Op Code (0x80), a Parameter Value representing Request Op Code (0x03)
followed by the correct Result Code.
Alternative 1:
- If the IUT does not support the minimum value defined of the range, the IUT sends the Result
Code for ‘Invalid Parameter’ (0x03) without any following Response Parameters.

```
Alternative 2:
```
- If the IUT does support the minimum value defined of the range, the IUT sends the Result
    Code for ‘Success’ (0x01) without any following Response Parameters.
6. The Lower Tester receives an ATT_Handle_Value_Indication from the IUT containing the Fitness
Machine Control Point characteristic handle and value.
7. The Lower Tester sends an ATT_Handle_Value_Confirmation to the IUT.
8. Verify that the characteristic value meets the requirements of the service.
9. Alternative 3:
- The Lower Tester writes the Set Target Inclination Procedure Op Code (0x03) to the Fitness
Machine Control Point with a value that is larger than the Maximum Inclination Field value of
the Supported Inclination Range characteristic found in step 2.

```
Alternative 4:
```
- If the IUT supports the maximum value defined of the range, the Lower Tester writes the Set
    Target Inclination Procedure Op Code (0x03) to the Fitness Machine Control Point with the
    Maximum Inclination Field value of the Supported Inclination Range characteristic.


10. The IUT sends an indication of the Fitness Machine Control Point characteristic with the
    Response Code Op Code (0x80), a Parameter Value representing Request Op Code (0x03)
    followed by the correct Result Code.
    Alternative 3:
    - If the IUT does not support the maximum value defined of the range, the IUT sends the
       Result Code for ‘Invalid Parameter’ (0x03) without any following Response Parameters.

```
Alternative 4:
```
- If the IUT does support the maximum value defined of the range, the IUT sends the Result
    Code for ‘Success’ (0x01) without any following Response Parameters.
11. The Lower Tester receives an ATT_Handle_Value_Indication from the IUT containing the Fitness
Machine Control Point characteristic handle and value.
12. The Lower Tester sends an ATT_Handle_Value_Confirmation to the IUT.
13. Verify that the characteristic value meets the requirements of the service.
- Expected Outcome

```
Pass verdict
```
```
Steps 1– 8 :
```
```
The IUT sends one indication of the Fitness Machine Control Point characteristic with a Result Code
set to Success in response to the Request Control procedure executed in step 4.
```
```
The IUT sends one indication of the Fitness Machine Control Point characteristic with the Response
Code Op Code containing a valid Parameter Value in response to the Set Target Inclination
procedure executed in step 5.
```
```
Alternative 1: The indication contains the Result Code for ‘Invalid Parameter’ (0x03).
```
```
Alternative 2: The indication contains the Result Code for ‘Success’ (0x0 1 ).
```
```
Steps 9 – 13 :
```
```
The IUT sends one indication of the Fitness Machine Control Point characteristic with the Response
Code Op Code containing a valid Parameter Value in response to the Set Target Inclination
procedure executed in step 10.
```
```
Alternative 3 : The indication contains the Result Code for ‘Invalid Parameter’ (0x03).
```
```
Alternative 4: The indication contains the Result Code for ‘Success’ (0x0 1 ).
```
## Level Procedure] FTMS/SR/SPE/BI- 06 - C [Fitness Machine Control Point – Out of Range Parameter Set Target Resistance

Target Resistance Level Procedure]

- Test Purpose

```
Verify that the IUT will respond with the correct response Op Code.
```
- Reference

```
[4] 4.16.2.5, 4.16.2.22
```
- Initial Condition
    - Perform the preamble described in Section 4.2.3.


- Test Procedure
    1. A connection is established between the Lower Tester and IUT.
    2. The Lower Tester reads the Supported Resistance Level Range characteristic (e.g. by executing
       test case FTMS/SR/CR/BV- 05 - C [Characteristic Read – Supported Resistance Level Range] or
       by other means).
    3. The Lower Tester requests the control of the IUT by executing the test procedure of the test case
       FTMS/SR/CW/BV- 01 - C [Fitness Machine Control Point – Request Control Procedure].
    4. Alternative 1:
       - The Lower Tester writes the Set Target Resistance Level Procedure Op Code (0x04) to the
          Fitness Machine Control Point with a value that is smaller than the Minimum Resistance Field
          value of the Supported Resistance Level Range characteristic found in step 2.

```
Alternative 2:
```
- If the IUT supports the minimum value defined of the range, the Lower Tester writes the Set
    Target Resistance Level Procedure Op Code (0x04) to the Fitness Machine Control Point
    with the Minimum Resistance Field value of the Supported Resistance Level Range
    characteristic.
5. The IUT sends an indication of the Fitness Machine Control Point characteristic with the
Response Code Op Code (0x80), a Parameter Value representing Request Op Code (0x04)
followed by the correct Result Code.
Alternative 1:
- If the IUT does not support the minimum value defined of the range, the IUT sends the Result
Code for ‘Invalid Parameter’ (0x03) without any following Response Parameters.

```
Alternative 2:
```
- If the IUT does support the minimum value defined of the range, the IUT sends the Result
    Code for ‘Success’ (0x01) without any following Response Parameters.
6. The Lower Tester receives an ATT_Handle_Value_Indication from the IUT containing the Fitness
Machine Control Point characteristic handle and value.
7. The Lower Tester sends an ATT_Handle_Value_Confirmation to the IUT.
8. Verify that the characteristic value meets the requirements of the service.
9. Alternative 3:
- The Lower Tester writes the Set Target Resistance Level Procedure Op Code (0x04) to the
Fitness Machine Control Point with a value that is larger than the Maximum Resistance Level
Field value of the Supported Resistance Range characteristic found in step 2.

```
Alternative 4:
```
- If the IUT supports the maximum value defined of the range, the Lower Tester writes the Set
    Target Resistance Level Procedure Op Code (0x04) to the Fitness Machine Control Point
    with the Maximum Resistance Level Field value of the Supported Inclination Range
    characteristic.


10. The IUT sends an indication of the Fitness Machine Control Point characteristic with the
    Response Code Op Code (0x80), a Parameter Value representing Request Op Code (0x04)
    followed by the correct Result Code.
    Alternative 3:
    - If the IUT does not support the maximum value defined of the range the IUT sends the Result
       Code for ‘Invalid Parameter’ (0x03) without any following Response Parameters.

```
Alternative 4:
```
- If the IUT does support the maximum value defined of the range the IUT sends the Result
    Code for ‘Success’ (0x01) without any following Response Parameters.
11. The Lower Tester receives an ATT_Handle_Value_Indication from the IUT containing the Fitness
Machine Control Point characteristic handle and value.
12. The Lower Tester sends an ATT_Handle_Value_Confirmation to the IUT.
13. Verify that the characteristic value meets the requirements of the service.
- Expected Outcome

```
Pass verdict
```
```
Steps 1– 8 :
```
```
The IUT sends one indication of the Fitness Machine Control Point characteristic with a Result Code
set to Success in response to the Request Control procedure executed in step 4.
```
```
The IUT sends one indication of the Fitness Machine Control Point characteristic with the Response
Code Op Code containing a valid Parameter Value in response to the Set Target Resistance Level
procedure executed in step 5.
```
```
Alternative 1: The indication contains the Result Code for ‘Invalid Parameter’ (0x03).
```
```
Alternative 2: The indication contains the Result Code for ‘Success’ (0x01).
```
```
Steps 9 – 13 :
```
```
The IUT sends one indication of the Fitness Machine Control Point characteristic with the Response
Code Op Code containing a valid Parameter Value in response to the Set Target Resistance Level
procedure executed in step 10.
```
```
Alternative 3 : The indication contains the Result Code for ‘Invalid Parameter’ (0x03).
```
```
Alternative 4: The indication contains the Result Code for ‘Success’ (0x01).
```
## Procedure] FTMS/SR/SPE/BI- 07 - C [Fitness Machine Control Point – Out of Range Parameter Set Target Power

Target Power Procedure]

- Test Purpose

```
Verify that the IUT will respond with the correct response Op Code.
```
- Reference

```
[4] 4.16.2.6, 4.16.2.22
```
- Initial Condition
    - Perform the preamble described in Section 4.2.3.


- Test Procedure
    1. A connection is established between the Lower Tester and IUT.
    2. The Lower Tester reads the Supported Power Range characteristic (e.g. by executing test case
       FTMS/SR/CR/BV- 06 - C [Characteristic Read – Supported Power Range] or by other means).
    3. The Lower Tester requests the control of the IUT by executing the test procedure of the test case
       FTMS/SR/CW/BV- 01 - C [Fitness Machine Control Point – Request Control Procedure].
    4. Alternative 1:
       - The Lower Tester writes the Set Target Power Procedure Op Code (0x05) to the Fitness
          Machine Control Point with a value that is smaller than the Minimum Power Field value of the
          Supported Power Range characteristic found in step 2.

```
Alternative 2:
```
- If the IUT supports the minimum value defined of the range, the Lower Tester writes the Set
    Target Power Procedure Op Code (0x05) to the Fitness Machine Control Point with the
    Minimum Power Field value of the Supported Power Range characteristic.
5. The IUT sends an indication of the Fitness Machine Control Point characteristic with the
Response Code Op Code (0x80), a Parameter Value representing Request Op Code (0x05)
followed by the correct Result Code.
Alternative 1:
- If the IUT does not support the minimum value defined of the range, the IUT sends the Result
Code for ‘Invalid Parameter’ (0x03) without any following Response Parameters.

```
Alternative 2:
```
- If the IUT does support the minimum value defined of the range, the IUT sends the Result
    Code for ‘Success’ (0x01) without any following Response Parameters.
6. The Lower Tester receives an ATT_Handle_Value_Indication from the IUT containing the Fitness
Machine Control Point characteristic handle and value.
7. The Lower Tester sends an ATT_Handle_Value_Confirmation to the IUT.
8. Verify that the characteristic value meets the requirements of the service.
9. Alternative 3:
- The Lower Tester writes the Set Target Power Procedure Op Code (0x05) to the Fitness
Machine Control Point with a value that is larger than the Maximum Power Field value of the
Supported Power Range characteristic found in step 2.

```
Alternative 4:
```
- If the IUT supports the maximum value defined of the range, the Lower Tester writes the Set
    Target Power Procedure Op Code (0x0 5 ) to the Fitness Machine Control Point with the
    Maximum Power Field value of the Supported Power Range characteristic.
10. The IUT sends an indication of the Fitness Machine Control Point characteristic with the
Response Code Op Code (0x80), a Parameter Value representing Request Op Code (0x05)
followed by the correct Result Code.
Alternative 3:
- If the IUT does not support the maximum value defined of the range, the IUT sends the
Result Code for ‘Invalid Parameter’ (0x03) without any following Response Parameters.

```
Alternative 4:
```
- If the IUT does support the maximum value defined of the range, the IUT sends the Result
    Code for ‘Success’ (0x01) without any following Response Parameters.


11. The Lower Tester receives an ATT_Handle_Value_Indication from the IUT containing the Fitness
    Machine Control Point characteristic handle and value.
12. The Lower Tester sends an ATT_Handle_Value_Confirmation to the IUT.
13. Verify that the characteristic value meets the requirements of the service.
- Expected Outcome

```
Pass verdict
```
```
Steps 1– 8 :
```
```
The IUT sends one indication of the Fitness Machine Control Point characteristic with a Result Code
set to Success in response to the Request Control procedure executed in step 4.
```
```
The IUT sends one indication of the Fitness Machine Control Point characteristic with the Response
Code Op Code containing a valid Parameter Value in response to the Set Target Power procedure
executed in step 5.
```
```
Alternative 1 : The indication contains the Result Code for ‘Invalid Parameter’ (0x03).
```
```
Alternative 2: The indication contains the Result Code for ‘Success’ (0x0 1 ).
```
```
Steps 9 – 13 :
```
```
The IUT sends one indication of the Fitness Machine Control Point characteristic with the Response
Code Op Code containing a valid Parameter Value in response to the Set Target Power procedure
executed in step 10.
```
```
Alternative 3 : The indication contains the Result Code for ‘Invalid Parameter’ (0x03).
```
```
Alternative 4: The indication contains the Result Code for ‘Success’ (0x0 1 ).
```
## Procedure] FTMS/SR/SPE/BI- 08 - C [Fitness Machine Control Point – Out of Range Parameter Set Target Heart Rate

Target Heart Rate Procedure]

- Test Purpose

```
Verify that the IUT will respond with the correct response Op Code.
```
- Reference

```
[4] 4.16.2.7, 4.16.2.22
```
- Initial Condition
    - Perform the preamble described in Section 4.2.3.
- Test Procedure
    1. A connection is established between the Lower Tester and IUT.
    2. The Lower Tester reads the Supported Heart Rate Range characteristic (e.g. by executing test
       case FTMS/SR/CR/BV- 07 - C [Characteristic Read – Supported Heart Rate Range] or by other
       means).
    3. The Lower Tester requests the control of the IUT by executing the test procedure of the test case
       FTMS/SR/CW/BV- 01 - C [Fitness Machine Control Point – Request Control Procedure].


4. Alternative 1:
    - The Lower Tester writes the Set Target Heart Rate Procedure Op Code (0x06) to the Fitness
       Machine Control Point with a value that is smaller than the Minimum Heart Rate Field value
       of the Supported Heart Rate Range characteristic found in step 2.

```
Alternative 2:
```
- If the IUT supports the minimum value defined of the range, the Lower Tester writes the Set
    Target Heart Rate Procedure Op Code (0x06) to the Fitness Machine Control Point with the
    Minimum Heart Rate Field value of the Supported Heart Rate Range characteristic.
5. The IUT sends an indication of the Fitness Machine Control Point characteristic with the
Response Code Op Code (0x80), a Parameter Value representing Request Op Code (0x06)
followed by the correct Result Code.
Alternative 1:
- If the IUT does not support the minimum value defined of the range, the IUT sends the Result
Code for ‘Invalid Parameter’ (0x03) without any following Response Parameters.

```
Alternative 2:
```
- If the IUT does support the minimum value defined of the range, the IUT sends the Result
    Code for ‘Success’ (0x01) without any following Response Parameters.
6. The Lower Tester receives an ATT_Handle_Value_Indication from the IUT containing the Fitness
Machine Control Point characteristic handle and value.
7. The Lower Tester sends an ATT_Handle_Value_Confirmation to the IUT.
8. Verify that the characteristic value meets the requirements of the service.
9. Alternative 3:
- The Lower Tester writes the Set Target Heart Rate Procedure Op Code (0x06) to the Fitness
Machine Control Point with a value that is larger than the Maximum Heart Rate Field value of
the Supported Heart Rate Range characteristic found in step 2.

```
Alternative 4:
```
- If the IUT supports the maximum value defined of the range, the Lower Tester writes the Set
    Target Heart Rate Procedure Op Code (0x06) to the Fitness Machine Control Point with the
    Maximum Heart Rate Field value of the Supported Heart Rate Range characteristic.
10. The IUT sends an indication of the Fitness Machine Control Point characteristic with the
Response Code Op Code (0x80), a Parameter Value representing Request Op Code (0x06)
followed by the correct Result Code.
Alternative 3:
- If the IUT does not support the maximum value defined of the range, the IUT sends the
Result Code for ‘Invalid Parameter’ (0x03) without any following Response Parameters.

```
Alternative 4:
```
- If the IUT does support the maximum value defined of the range, the IUT sends the Result
    Code for ‘Success’ (0x01) without any following Response Parameters.
11. The Lower Tester receives an ATT_Handle_Value_Indication from the IUT containing the Fitness
Machine Control Point characteristic handle and value.
12. The Lower Tester sends an ATT_Handle_Value_Confirmation to the IUT.
13. Verify that the characteristic value meets the requirements of the service.


- Expected Outcome

```
Pass verdict
```
```
Steps 1– 8 :
```
```
The IUT sends one indication of the Fitness Machine Control Point characteristic with a Result Code
set to Success in response to the Request Control procedure executed in step 4.
```
```
The IUT sends one indication of the Fitness Machine Control Point characteristic with the Response
Code Op Code containing a valid Parameter Value in response to the Set Target Heart Rate
procedure executed in step 5.
```
```
Alternative 1: The indication contains the Result Code for ‘Invalid Parameter’ (0x03).
```
```
Alternative 2: The indication contains the Result Code for ‘Success’ (0x01).
```
```
Steps 9 – 13 :
```
```
The IUT sends one indication of the Fitness Machine Control Point characteristic with the Response
Code Op Code containing a valid Parameter Value in response to the Set Target Heart Rate
procedure executed in step 10.
```
```
Alternative 3 : The indication contains the Result Code for ‘Invalid Parameter’ (0x03).
```
```
Alternative 4: The indication contains the Result Code for ‘Success’ (0x01).
```
## FTMS/SR/SPE/BV- 09 - C [Fitness Machine Control Point – Control Not Permitted]

- Test Purpose

```
Verify that the IUT will respond with the correct response Op Code.
```
- Reference

```
[4] 4.16.2.21
```
- Initial Condition
    - Perform the preamble described in Section 4.2.3.
- Test Procedure
    1. A connection is established between the Lower Tester and IUT.
    2. The Lower Tester writes the Start or Resume Op Code (0x07) to the Fitness Machine Control
       Point with no additional parameters.
    3. The IUT sends an indication of the Fitness Machine Control Point characteristic with the
       Response Code Op Code (0x80), a Parameter Value representing Request Op Code (0x07)
       followed by the Result Code for ‘Control Not Permitted’ (0x05) without any following Response
       Parameters.
    4. The Lower Tester receives an ATT_Handle_Value_Indication from the IUT containing the Fitness
       Machine Control Point characteristic handle and value.
    5. The Lower Tester sends an ATT_Handle_Value_Confirmation to the IUT.
    6. Verify that the characteristic value meets the requirements of the service.
- Expected Outcome

```
Pass verdict
```
```
The IUT sends one indication of the Fitness Machine Control Point characteristic with a Result Code
set to Control Not Permitted in response to the Start or Resume procedure executed in step 3.
```

## 5 Test case mapping

The Test Case Mapping Table (TCMT) maps test cases to specific requirements in the ICS. The IUT is
tested in all roles for which support is declared in the ICS document.

The columns for the TCMT are defined as follows:

Item: Contains a logical expression based on specific entries from the associated ICS document.
Contains a logical expression (using the operators AND, OR, NOT as needed) based on specific entries
from the applicable ICS document(s). The entries are in the form of y/x references, where y corresponds
to the table number and x corresponds to the feature number as defined in the ICS document for Fitness

Machine Service (FTMS) [5].

Feature: A brief, informal description of the feature being tested.

Test Case(s): The applicable test case identifiers are required for Bluetooth Qualification if the
corresponding y/x references defined in the Item column are supported. Further details about the function

of the TCMT are elaborated in [2].

For the purpose and structure of the ICS/IXIT, refer to [2].

```
Item Feature Test Case(s)
FTMS 2 /1 OR
FTMS 2/2
```
```
Fitness Machine Service - Service Definition FTMS/SR/SGGIT/SER/BV- 01 - C
```
```
FTMS 2/1 Fitness Machine Service – SDP Record FTMS/SR/SGGIT/SDP/BV- 01 - C
FTMS 4/1 Fitness Machine Feature Characteristic FTMS/SR/CR/BV- 01 - C
FTMS 4/1 AND
NOT FTMS 4a/2
```
```
Fitness Machine Feature Characteristic FTMS/SR/SGGIT/CHA/BV- 01 - C
```
```
FTMS 4a/2 Fitness Machine Feature Indication FTMS/SR/SGGIT/CHA/BV- 16 - C
FTMS/SR/SGGIT/ISFC/BV- 01 - C
FTMS 4/3 AND
FTMS 4/40
```
```
Treadmill Data Characteristic, Transmission
of a Data Record
```
#### FTMS/SR/CN/BV- 01 - C

```
FTMS 4/3 Treadmill Data Characteristic FTMS/SR/SGGIT/CHA/BV- 02 - C
FTMS/SR/CON/BV- 01 - C
FTMS 4/4 AND
FTMS 4/40
```
```
Cross Trainer Data Characteristic,
Transmission of a Data Record
```
#### FTMS/SR/CN/BV- 13 - C

```
FTMS 4/4 Cross Trainer Data Characteristic FTMS/SR/SGGIT/CHA/BV- 03 - C
FTMS/SR/CON/BV- 02 - C
FTMS 4/5 AND
FTMS 4/40
```
```
Step Climber Data Characteristic,
Transmission of a Data Record
```
#### FTMS/SR/CN/BV- 27 - C

```
FTMS 4/5 Step Climber Data Characteristic FTMS/SR/SGGIT/CHA/BV- 04 - C
FTMS/SR/CON/BV- 03 - C
FTMS 4/6 AND
FTMS 4/40
```
```
Stair Climber Data Characteristic,
Transmission of a Data Record
```
#### FTMS/SR/CN/BV- 35 - C

```
FTMS 4/6 Stair Climber Data Characteristic FTMS/SR/SGGIT/CHA/BV- 05 - C
FTMS/SR/CON/BV- 04 - C
FTMS 4/7 AND
FTMS 4/40
```
```
Rower Data Characteristic, Transmission of a
Data Record
```
#### FTMS/SR/CN/BV- 44 - C

```
FTMS 4/7 Rower Data Characteristic FTMS/SR/SGGIT/CHA/BV- 06 - C
FTMS/SR/CON/BV- 05 - C
```

Item Feature Test Case(s)

FTMS 4/8 AND
FTMS 4/40

```
Indoor Bike Data Characteristic, Transmission
of a Data Record
```
#### FTMS/SR/CN/BV- 55 - C

FTMS 4/8 Indoor Bike Data Characteristic FTMS/SR/SGGIT/CHA/BV- 07 - C
FTMS/SR/CON/BV- 06 - C

FTMS 4/9 Training Status FTMS/SR/SGGIT/CHA/BV- 08 - C

```
FTMS/SR/CR/BV- 02 - C
FTMS/SR/CON/BV- 07 - C
```
FTMS 3/18 AND
FTMS 4/2 AND
FTMS 4/10

```
Supported Speed Range FTMS/SR/SGGIT/CHA/BV- 09 - C
FTMS/SR/CR/BV- 03 - C
```
#### FTMS 3/19 AND

#### FTMS 4/2 AND

#### FTMS 4/11

```
Supported Inclination Range FTMS/SR/SGGIT/CHA/BV- 10 - C
FTMS/SR/CR/BV- 04 - C
```
#### FTMS 3/20 AND

#### FTMS 4/2 AND

#### FTMS 4/12

```
Supported Resistance Level Range FTMS/SR/SGGIT/CHA/BV- 11 - C
FTMS/SR/CR/BV- 05 - C
```
#### FTMS 3/21 AND

#### FTMS 4/2 AND

#### FTMS 4/13

```
Supported Power Range FTMS/SR/SGGIT/CHA/BV- 12 - C
FTMS/SR/CR/BV- 06 - C
```
#### FTMS 3/22 AND

#### FTMS 4/2 AND

#### FTMS 4/14

```
Supported Heart Rate Range FTMS/SR/SGGIT/CHA/BV- 13 - C
FTMS/SR/CR/BV- 07 - C
```
FTMS 4/15 Fitness Machine Control Point FTMS/SR/SGGIT/CHA/BV- 14 - C

```
FTMS/SR/CON/BV- 08 - C
```
FTMS 4/16 Fitness Machine Status FTMS/SR/SGGIT/CHA/BV- 15 - C
FTMS/SR/CON/BV- 09 - C

FTMS 3/1 AND
FTMS 5/1

```
Average Speed Supported,
Treadmill Data - Average Speed
```
#### FTMS/SR/CN/BV- 02 - C

#### FTMS 3/3 AND

#### FTMS 5/2

```
Total Distance Supported,
Treadmill Data – Total Distance
```
#### FTMS/SR/CN/BV- 03 - C

#### FTMS 3/4 AND

#### FTMS 5/3 AND

#### FTMS 5/4

```
Inclination Supported,
Treadmill Data – Inclination,
Treadmill Data – Ramp Angle Setting
```
#### FTMS/SR/CN/BV- 04 - C

#### FTMS 3/5 AND

#### FTMS 5/5

```
Elevation Gain Supported,
Treadmill Data – Positive Elevation Gain and
Negative Elevation Gain Pair
```
#### FTMS/SR/CN/BV- 05 - C

#### FTMS 3/6 AND

#### FTMS 5/6 AND

#### FTMS 5/7

```
Pace Supported,
Treadmill Data – Instantaneous Pace,
Average Pace
```
#### FTMS/SR/CN/BV- 06 - C

#### FTMS 3/10 AND

#### FTMS 5/8 AND

#### FTMS 5/9 AND

#### FTMS 5/10

```
Expended Energy Supported,
Treadmill Data – Total Energy,
Energy per Hour,
Energy per Minute
```
#### FTMS/SR/CN/BV- 07 - C

#### FTMS 3/11 AND

#### FTMS 5/11

```
Heart Rate Measurement Supported,
Treadmill Data – Heart Rate
```
#### FTMS/SR/CN/BV- 08 - C

#### FTMS 3/12 AND

#### FTMS 5/12

```
Metabolic Equivalent Supported,
Treadmill Data – Metabolic Equivalent
```
#### FTMS/SR/CN/BV- 09 - C


Item Feature Test Case(s)

FTMS 3/14 AND
FTMS 5/14

```
Remaining Time Supported,
Treadmill Data – Remaining Time
```
#### FTMS/SR/CN/BV- 10 - C

#### FTMS 3/16 AND

#### FTMS 5/15 AND

#### FTMS 5/16

```
Force on Belt and Power Output Supported,
Treadmill Data – Force on Belt,
Power Output
```
#### FTMS/SR/CN/BV- 11 - C

#### FTMS 3/13 AND

#### FTMS 4/39 AND

#### FTMS 5/13

```
Elapsed Time Supported,
Treadmill Data – Elapsed Time
```
#### FTMS/SR/CN/BV- 12 - C

#### FTMS 3/1 AND

#### FTMS 6/1

```
Average Speed Supported,
Cross Trainer Data - Average Speed
```
#### FTMS/SR/CN/BV- 14 - C

#### FTMS 3/3 AND

#### FTMS 6/2

```
Total Distance Supported,
Cross Trainer Data – Total Distance
```
#### FTMS/SR/CN/BV- 15 - C

#### FTMS 3/7 AND

#### FTMS 6/3 AND

#### FTMS 6/4

```
Step Count Supported,
Cross Trainer Data – Step per Minute,
Average Step Rate
```
#### FTMS/SR/CN/BV- 16 - C

#### FTMS 3/9 AND

#### FTMS 6/5

```
Stride Count Supported,
Cross Trainer Data – Stride Count
```
#### FTMS/SR/CN/BV- 17 - C

#### FTMS 3/5 AND

#### FTMS 6/6

```
Elevation Gain Supported,
Cross Trainer Data – Positive Elevation Gain
and Negative Elevation Gain Pair
```
#### FTMS/SR/CN/BV- 18 - C

#### FTMS 3/4 AND

#### FTMS 6/7 AND

#### FTMS 6/8

```
Inclination Supported,
Cross Trainer Data – Inclination,
Ramp Angle Setting
```
#### FTMS/SR/CN/BV- 19 - C

#### FTMS 3/8 AND

#### FTMS 6/9

```
Resistance Level Supported,
Cross Trainer Data – Resistance Level
```
#### FTMS/SR/CN/BV- 20 - C

#### FTMS 3/15 AND

#### FTMS 6/10 AND

#### FTMS 6/11

```
Power Measurement Supported,
Cross Trainer Data – Instantaneous Power,
Average Power
```
#### FTMS/SR/CN/BV- 21 - C

#### FTMS 3/10 AND

#### FTMS 6/12 AND

#### FTMS 6/13 AND

#### FTMS 6/14

```
Expended Energy Supported,
Cross Trainer Data – Total Energy,
Energy per Hour,
Energy per Minute
```
#### FTMS/SR/CN/BV- 22 - C

#### FTMS 3/11 AND

#### FTMS 6/15

```
Heart Rate Measurement Supported,
Cross Trainer Data – Heart Rate
```
#### FTMS/SR/CN/BV- 23 - C

#### FTMS 3/12 AND

#### FTMS 6/16

```
Metabolic Equivalent Supported,
Cross Trainer Data – Metabolic Equivalent
```
#### FTMS/SR/CN/BV- 24 - C

#### FTMS 3/13 AND

#### FTMS 4/39 AND

#### FTMS 6/17

```
Elapsed Time Supported,
Cross Trainer Data – Elapsed Time
```
#### FTMS/SR/CN/BV- 25 - C

#### FTMS 3/14 AND

#### FTMS 6/18

```
Remaining Time Supported,
Cross Trainer Data – Remaining Time
```
#### FTMS/SR/CN/BV- 26 - C

#### FTMS 3/7 AND

#### FTMS 7/1 AND

#### FTMS 7/2

```
Step Count Supported,
Step Climber Data – Step per Minute,
Average Step Rate
```
#### FTMS/SR/CN/BV- 28 - C

#### FTMS 3/5 AND

#### FTMS 7/3

```
Elevation Gain Supported,
Step Climber Data – Positive Elevation Gain
```
#### FTMS/SR/CN/BV- 29 - C


Item Feature Test Case(s)

FTMS 3/10 AND
FTMS 7/4 AND
FTMS 7/5 AND
FTMS 7/6

```
Step Climber Data – Total Energy,
Energy per Hour,
Energy per Minute
```
#### FTMS/SR/CN/BV- 30 - C

#### FTMS 3/11 AND

#### FTMS 7/7

```
Heart Rate Measurement Supported,
Step Climber Data – Heart Rate
```
#### FTMS/SR/CN/BV- 31 - C

#### FTMS 3/12 AND

#### FTMS 7/8

```
Metabolic Equivalent Supported,
Step Climber Data – Metabolic Equivalent
```
#### FTMS/SR/CN/BV- 32 - C

#### FTMS 3/13 AND

#### FTMS 4/39 AND

#### FTMS 7/9

```
Elapsed Time Supported,
Step Climber Data – Elapsed Time
```
#### FTMS/SR/CN/BV- 33 - C

#### FTMS 3/14 AND

#### FTMS 7/10

```
Remaining Time Supported,
Step Climber Data – Remaining Time
```
#### FTMS/SR/CN/BV- 34 - C

#### FTMS 3/7 AND

#### FTMS 8/1 AND

#### FTMS 8/2

```
Step Count Supported,
Stair Climber Data – Step per Minute,
Average Step Rate
```
#### FTMS/SR/CN/BV- 36 - C

#### FTMS 3/5 AND

#### FTMS 8/3

```
Stair Climber Data – Positive Elevation Gain FTMS/SR/CN/BV- 37 - C
```
#### FTMS 3/9 AND

#### FTMS 8/4

```
Stride Count Supported,
Stair Climber Data – Stride Count
```
#### FTMS/SR/CN/BV- 38 - C

#### FTMS 3/10 AND

#### FTMS 8/5 AND

#### FTMS 8/6 AND

#### FTMS 8/7

```
Expended Energy Supported,
Stair Climber Data – Total Energy,
Energy per Hour,
Energy per Minute
```
#### FTMS/SR/CN/BV- 39 - C

#### FTMS 3/11 AND

#### FTMS 8/8

```
Heart Rate Measurement Supported,
Stair Climber Data – Heart Rate
```
#### FTMS/SR/CN/BV- 40 - C

#### FTMS 3/12 AND

#### FTMS 8/9

```
Metabolic Equivalent Supported,
Stair Climber Data – Metabolic Equivalent
```
#### FTMS/SR/CN/BV- 41 - C

#### FTMS 3/13 AND

#### FTMS 4/39 AND

#### FTMS 8/10

```
Elapsed Time Supported,
Stair Climber Data – Elapsed Time
```
#### FTMS/SR/CN/BV- 42 - C

#### FTMS 3/14 AND

#### FTMS 8/11

```
Remaining Time Supported,
Stair Climber Data – Remaining Time
```
#### FTMS/SR/CN/BV- 43 - C

#### FTMS 3/2 AND

#### FTMS 9/1

```
Cadence Supported,
Rower Data – Average Stroke Rate
```
#### FTMS/SR/CN/BV- 45 - C

#### FTMS 3/3 AND

#### FTMS 9/2

```
Total Distance Supported,
Rower Data – Total Distance
```
#### FTMS/SR/CN/BV- 46 - C

#### FTMS 3/6 AND

#### FTMS 9/3 AND

#### FTMS 9/4

```
Pace Supported,
Rower Data – Instantaneous Pace, Average
Pace
```
#### FTMS/SR/CN/BV- 47 - C

#### FTMS 3/15 AND

#### FTMS 9/5 AND

#### FTMS 9/6

```
Power Measurement Supported,
Rower Data – Instantaneous Power, Average
Power
```
#### FTMS/SR/CN/BV- 48 - C

#### FTMS 3/8 AND

#### FTMS 9/7

```
Resistance Level Supported,
Rower Data – Resistance Level
```
#### FTMS/SR/CN/BV- 49 - C


Item Feature Test Case(s)

FTMS 3/10 AND
FTMS 9/8 AND
FTMS 9/9 AND
FTMS 9/10

```
Expended Energy Supported,
Rower Data – Total Energy,
Energy per Hour,
Energy per Minute
```
#### FTMS/SR/CN/BV- 50 - C

#### FTMS 3/11 AND

#### FTMS 9/11

```
Heart Rate Measurement Supported,
Rower Data – Heart Rate
```
#### FTMS/SR/CN/BV- 51 - C

#### FTMS 3/12 AND

#### FTMS 9/12

```
Metabolic Equivalent Supported,
Rower Data – Metabolic Equivalent
```
#### FTMS/SR/CN/BV- 52 - C

#### FTMS 3/14 AND

#### FTMS 9/14

```
Remaining Time Supported,
Rower Data – Remaining Time
```
#### FTMS/SR/CN/BV- 53 - C

#### FTMS 3/13 AND

#### FTMS 4/39 AND

#### FTMS 9/13

```
Elapsed Time Supported,
Rower Data – Elapsed Time
```
#### FTMS/SR/CN/BV- 54 - C

#### FTMS 3/1 AND

#### FTMS 10/1

```
Average Speed Supported,
Indoor Bike – Average Speed
```
#### FTMS/SR/CN/BV- 56 - C

#### FTMS 3/2 AND

#### FTMS 10/2 AND

#### FTMS 10/3

```
Cadence Supported,
Indoor Bike – Instantaneous Cadence,
Average Cadence
```
#### FTMS/SR/CN/BV- 57 - C

#### FTMS 3/3 AND

#### FTMS 10/4

```
Total Distance Supported,
Indoor Bike – Total Distance
```
#### FTMS/SR/CN/BV- 58 - C

#### FTMS 3/8 AND

#### FTMS 10/5

```
Resistance Level Supported,
Indoor Bike – Resistance Level
```
#### FTMS/SR/CN/BV- 59 - C

#### FTMS 3/15 AND

#### FTMS 10/6 AND

#### FTMS 10/7

```
Power Measurement Supported,
Indoor Bike – Instantaneous Power, Average
Power
```
#### FTMS/SR/CN/BV- 60 - C

#### FTMS 3/10 AND

#### FTMS 10/8 AND

#### FTMS 10/9 AND

#### FTMS 10/10

```
Expended Energy Supported,
Indoor Bike – Total Energy,
Energy per Hour,
Energy per Minute
```
#### FTMS/SR/CN/BV- 61 - C

#### FTMS 3/11 AND

#### FTMS 10/11

```
Heart Rate Measurement Supported,
Indoor Bike – Heart Rate
```
#### FTMS/SR/CN/BV- 62 - C

#### FTMS 3/12 AND

#### FTMS 10/12

```
Metabolic Equivalent Supported,
Indoor Bike – Metabolic Equivalent
```
#### FTMS/SR/CN/BV- 63 - C

#### FTMS 3/14 AND

#### FTMS 10/14

```
Remaining Time Supported,
Indoor Bike – Remaining Time
```
#### FTMS/SR/CN/BV- 64 - C

#### FTMS 3/13 AND

#### FTMS 4/39 AND

#### FTMS 10/13

```
Elapsed Time Supported,
Indoor Bike – Elapsed Time
```
#### FTMS/SR/CN/BV- 65 - C

FTMS 4/9 Training Status FTMS/SR/TSN/BV- 01 - C

FTMS 11/1 Training Status String FTMS/SR/TSN/BV- 02 - C

FTMS 11/2 Training Status Extended String FTMS/SR/TSN/BV- 03 - C

FTMS 4/17 AND
FTMS 12/2

```
Fitness Machine Status Reset,
Reset Procedure
```
#### FTMS/SR/FMSN/BV- 01 - C

#### FTMS/SR/CW/BV- 02 - C

#### FTMS 4/18 AND

#### FTMS 12/9

```
Fitness Machine Stopped by the User FTMS/SR/FMSN/BV- 02 - C
FTMS/SR/CW/BV- 09 - C
```

Item Feature Test Case(s)

FTMS 4/18 AND
FTMS 12/10

```
Fitness Machine Paused by the User FTMS/SR/FMSN/BV- 03 - C
FTMS/SR/CW/BV- 10 - C
```
FTMS 4/19 Fitness Machine Stopped by Safety Key FTMS/SR/FMSN/BV- 04 - C

FTMS 4/20 AND
FTMS 12/8

```
Fitness Machine Started or Resumed by the
User
```
#### FTMS/SR/FMSN/BV- 05 - C

#### FTMS/SR/CW/BV- 08 - C

#### FTMS 3/18 AND

#### FTMS 12/3

```
Speed Target Setting Supported,
Set Target Speed
```
#### FTMS/SR/FMSN/BV- 06 - C

#### FTMS/SR/CW/BV- 03 - C

#### FTMS 3/19 AND

#### FTMS 12/4

```
Inclination Target Setting Supported,
Set Target Inclination Procedure
```
#### FTMS/SR/FMSN/BV- 07 - C

#### FTMS/SR/CW/BV- 04 - C

#### FTMS 3/20 AND

#### FTMS 12/5

```
Resistance Target Setting Supported,
Set Target Resistance Level
```
#### FTMS/SR/CW/BV- 05 - C

#### FTMS 3/20 AND

#### FTMS 12/5 AND

NOT FTMS 0b/ 1

```
Resistance Target Setting Supported,
Set Target Resistance Level – UINT8
```
#### FTMS/SR/FMSN/BV- 08 - C

#### FTMS 3/20 AND

#### FTMS 12/5 AND

FTMS 0b/1

```
Resistance Target Setting Supported,
Set Target Resistance Level – SINT16
```
#### FTMS/SR/FMSN/BV- 25 - C

#### FTMS 3/21 AND

#### FTMS 12/6

```
Power Target Setting Supported,
Set Target Power
```
#### FTMS/SR/FMSN/BV- 09 - C

#### FTMS/SR/CW/BV- 06 - C

#### FTMS 3/22 AND

#### FTMS 12/7

```
Heart Rate Target Setting Supported,
Set Target Heart Rate
```
#### FTMS/SR/FMSN/BV- 10 - C

#### FTMS/SR/CW/BV- 07 - C

#### FTMS 3/23 AND

#### FTMS 4/26 AND

#### FTMS 12/11

```
Targeted Expended Energy Configuration
Supported,
Set Targeted Expended Energy
```
#### FTMS/SR/FMSN/BV- 11 - C

#### FTMS/SR/CW/BV- 11 - C

#### FTMS 3/24 AND

#### FTMS 4/27 AND

#### FTMS 12/12

```
Targeted Step Number Configuration
Supported,
Set Targeted Number of Steps
```
#### FTMS/SR/FMSN/BV- 12 - C

#### FTMS/SR/CW/BV- 12 - C

#### FTMS 3/25 AND

#### FTMS 4/28 AND

#### FTMS 12/13

```
Targeted Stride Number Configuration
Supported,
Set Targeted Number of Strides
```
#### FTMS/SR/FMSN/BV- 13 - C

#### FTMS/SR/CW/BV- 13 - C

#### FTMS 3/26 AND

#### FTMS 4/29 AND

#### FTMS 12/14

```
Targeted Distance Configuration Supported,
Set Targeted Distance
```
#### FTMS/SR/FMSN/BV- 14 - C

#### FTMS/SR/CW/BV- 14 - C

#### FTMS 3/27 AND

#### FTMS 4/30 AND

#### FTMS 12/15

```
Targeted Training Time Configuration
Supported,
Set Targeted Training Time
```
#### FTMS/SR/FMSN/BV- 15 - C

#### FTMS/SR/CW/BV- 15 - C

#### FTMS 3/28 AND

#### FTMS 4/31 AND

#### FTMS 12/16

```
Targeted Time in Two Heart Rate Zones
Configuration Supported,
Set Targeted Time in Two Heart Rate Zones
```
#### FTMS/SR/FMSN/BV- 16 - C

#### FTMS/SR/CW/BV- 16 - C

#### FTMS 3/29 AND

#### FTMS 4/32 AND

#### FTMS 12/17

```
Targeted Time in Three Heart Rate Zones
Configuration Supported,
Set Targeted Time in Three Heart Rate Zones
```
#### FTMS/SR/FMSN/BV- 17 - C

#### FTMS/SR/CW/BV- 17 - C

#### FTMS 3/30 AND

#### FTMS 4/33 AND

#### FTMS 12/18

```
Targeted Time in Five Heart Rate Zones
Configuration Supported,
Set Targeted Time in Five Heart Rate Zones
```
#### FTMS/SR/FMSN/BV- 18 - C

#### FTMS/SR/CW/BV- 18 - C


```
Item Feature Test Case(s)
FTMS 12/19 AND
FTMS 4/34 AND
FTMS 3/31
```
```
Indoor Bike Simulation Parameters
Supported,
Set Indoor Bike Simulation
```
#### FTMS/SR/FMSN/BV- 19 - C

#### FTMS/SR/CW/BV- 19 - C

#### FTMS 12/20 AND

#### FTMS 4/35 AND

#### FTMS 3/32

```
Set Wheel Circumference,
Wheel Circumference Configuration
Supported
```
#### FTMS/SR/FMSN/BV- 20 - C

#### FTMS/SR/CW/BV- 20 - C

#### FTMS 3/33 AND

#### FTMS 4/36 AND

#### FTMS 12/21

```
Spin Down Control Supported,
Spin Down Control
```
#### FTMS/SR/FMSN/BV- 21 - C

#### FTMS/SR/CW/BV- 21 - C

#### FTMS 3/34 AND

#### FTMS 4/41 AND

#### FTMS 12/22

```
Targeted Cadence Configuration Supported,
Targeted Cadence
```
#### FTMS/SR/FMSN/BV- 22 - C

#### FTMS/SR/CW/BV- 22 - C

#### FTMS 12/1 AND

#### FTMS 4/37 AND

#### FTMS 4/43

```
Request Control Procedure FTMS/SR/FMSN/BV- 23 - C
FTMS/SR/CW/BV- 01 - C
```
```
FTMS 4/42 FTM Status - Server Supports Connections to
Multiple Clients
```
#### FTMS/SR/FMSN/BV- 24 - C

```
FTMS 12/8 Invalid Start or Resume Procedure FTMS/SR/SPE/BV- 01 - C
FTMS 12/9 AND
FTMS 12/10
```
```
Invalid Stop or Pause Procedure FTMS/SR/SPE/BV- 02 - C
```
```
FTMS 4/15 Fitness Machine Control Point –^ Unsupported
Op Code
```
#### FTMS/SR/SPE/BV- 03 - C

#### FTMS 4/21 AND

#### FTMS 3/18

```
Out of Range Parameter Set Target Speed
Procedure
```
#### FTMS/SR/SPE/BV- 04 - C

#### FTMS 4/22 AND

#### FTMS 3/19

```
Out of Range Parameter Set Target
Inclination Procedure
```
#### FTMS/SR/SPE/BI- 05 - C

#### FTMS 4/23 AND

#### FTMS 3/20

```
Out of Range Parameter Set Target
Resistance Level Procedure
```
#### FTMS/SR/SPE/BI- 06 - C

#### FTMS 4/24 AND

#### FTMS 3/21

```
Out of Range Parameter Set Target Power
Procedure
```
#### FTMS/SR/SPE/BI- 07 - C

#### FTMS 4/25 AND

#### FTMS 3/22

```
Out of Range Parameter Set Target Heart
Rate Procedure
```
#### FTMS/SR/SPE/BI- 08 - C

```
FTMS 4/15 Fitness Machine Control Point –^ Control Not
Permitted
```
#### FTMS/SR/SPE/BV- 09 - C

Table 5. 1 : Test case mapping


## 6 Revision history and acknowledgments

Revision History

```
Publication
Number
```
```
Revision
Number
```
```
Date Comments
```
```
0 1.0.0 2017 - 02 - 17 Prepared for publication by Bluetooth SIG staff.
1.0.1r00 2017 - 08 - 17 TSE 9488: For FTMS/SR/CW/BV- 05 - C, revise the Op
Code Parameter Value in the Test Case Table.
1 1.0.1 2017 - 11 - 28 Approved by BTI. Prepared for TCRL 2017- 2
publication.
1.0.2r00 2018 - 05 - 10 TSE 10625 (rating 3): In the Fitness Machine Status
Notifications section, added Test Purpose heading,
revised Pass Verdict, and revised the parameter for
test cases FTMS/SR/FMSN/BV- 06 - C to 20-C and 22-
C in the pass verdict table.
Removed test case applicable from the TCMT. Added
12/9 to FTMS 4/18 and removed paused as part of the
feature for test cases FTMS/SR/FMSN/BV- 02 - C and
FTMS/SR/CW/BV- 09 - C. Separated test cases
FTMS/SR/FMSN/BV- 03 - C and FTMS/SR/CW/BV- 10 -
C from FTMS/SR/FMSN/BV- 02 - C and
FTMS/SR/CW/BV- 09 - C in its own row and added
FTMS 4/18 AND FTMS 12/10. Added 12/8 to FTMS
4/20 for test cases FTMS/SR/FMSN/BV- 05 - C and
FTMS/SR/CW/BV- 08 - C.
2 1.0.2 2018 - 06 - 27 Approved by BTI. Prepared for TCRL 2018 - 1
publication.
1.0.3r00-r01 2018 - 10 - 02 -
2018 - 10 - 29
```
```
TSE 10623 (rating 3): Updated Initial Condition and
Test Procedure for FTMS/SR/CW/BV- 02 - C - 22 - C.
TSE 10804 (rating 4): Updated FTMS/SR/SPE/BV- 05 -
C – 08 - C in spec body and TCMT: Changed test
behavior from valid to invalid; updated References,
Test Procedure, Pass verdict. Updated reference for
test case FTMS/SR/SPE/BI- 07 - C.
3 1.0.3 2018 - 11 - 21 Approved by BTI. Prepared for TCRL 2018- 2
publication.
p4r00–r04 2022 -^03 -^18 –^
2022 - 05 - 18
```
```
TSE 17262 (rating 2): Converted tests to GGIT: the
new GGIT TCIDs are: FTMS/SR/SGGIT/SDP/BV-
01 - C, FTMS/SR/SGGIT/SER/BV- 01 - C, and
FTMS/SR/SGGIT/CHA/BV- 01 - C – - 15 - C; the deleted
TCIDs are FTMS/SR/SD/BV- 01 - C and - 02 - C,
FTMS/SR/DEC/BV- 01 - C – - 15 - C, and FTMS/DES/BV-
01 - C – - 09 - C. Updated the “Test groups” section and
added the GGIT material to the TCID conventions
section. Updated the cross-references from the
deleted Characteristic Declaration and Characteristic
Descriptor sections to the new GATT Integrated Tests
section globally. Updated the TCMT accordingly.
TSE 18431 (rating 1): Removed direct references to
GATT test cases in FTMS/SR/CR/BV- 01 - C – - 07 - C,
FTMS/SR/CON/BV- 01 - C – - 09 - C, and
FTMS/SR/TSN/BV- 03 - C and in the Preambles
```

```
Publication
Number
```
```
Revision
Number
```
```
Date Comments
```
```
sections for ATT Bearer on LE Transport and ATT
Bearer on BR/EDR Transport.
TSE 18719 (rating 1): Editorials to align the document
with the latest TS template in anticipation of a future
.Z release.
Performed template-related formatting fixes. Assigned
publication number 3 to previous v1.0. 3 and aligned
copyright page with v2 of the DNMD. Consistency
checker editorials.
4 p4 2022 - 06 - 28 Approved by BTI on 2022- 05 - 31. Prepared for TCRL
2022 - 1 publication.
p5r00 2023 - 10 - 23 TSE 23234 (rating 2): Added one step to the test
procedure for FTMS/SR/CN/BV- 65 - C.
Performed other editorials to align the document with
the latest TS template, including updates to the scope,
references, Test Strategy, test case identification
conventions, conformance, Pass/Fail verdict
conventions, and TCMT introductory text. Deleted
draft revision history comments prior to p0.
5 p5 2024 - 07 - 01 Approved by BTI on 2024- 04 - 21. Prepared for
TCRL 2024 - 1 publication.
p6r00– 05 2024 -^07 -^24 –^
2024 - 10 - 08
```
```
TSE 16708 (rating 4): Per E16264, added new test
group ISFC. Added new test cases
FTMS/SR/SGGIT/CHA/BV- 16 - C and
FTMS/SR/SGGIT/ISFC/BV- 01 - C, and updated the
TCMT accordingly. Updated the TCMT for
FTMS/SR/SGGIT/CHA/BV- 01 - C. Added a reference
for FTMS Specification v1.0.1 and updated reference
numbering.
TSE 22632 (rating 4): Per E10194, added new test
case FTMS/SR/FMSN/BV- 25 - C, updated test case
FTMS/SR/FMSN/BV- 08 - C, and updated the TCMT
accordingly.
6 p6 2024 - 10 - 08 Approved by BTI on 2024- 09 - 11. FTMS v1.0.1
adopted by the BoD on 2024- 10 - 01. Prepared for
TCRL 2024- 2 - addition publication.
```
Acknowledgments

```
Name Company
Dejan Berec Bluetooth SIG, Inc.
Jeff Drake Bluetooth SIG, Inc.
Jim Harper Bluetooth SIG, Inc.
Jawid Mirani Bluetooth SIG, Inc.
Nathaniel Roby Bluetooth SIG, Inc.
Josh Toole Bluetooth SIG, Inc.
Guillaume Schatz Polar
```

