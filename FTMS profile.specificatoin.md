```
Bluetooth SIG Proprietary
```
Bluetooth® Profile Specification

```
▪ Revision: v1.
▪ Revision Date: 2017 - Feb- 14
▪ Group Prepared By: Sports and Fitness Working Group
▪ Feedback Email: sf-main@bluetooth.org
```
```
Abstract:
This Bluetooth profile enables a Collector device to connect and interact with a Fitness Machine intended for
sports/fitness applications.
```
# Fitness Machine Profile


Revision History

```
Revision Number Date Comments
```
```
D05r00 2015 - 09 - 23 Initial draft based on WSP
```
```
D05r01 2015 - 10 - 01 Accepted all changes. Empty sections have been completed and
UDS interaction has also been clarified.
```
```
D05r02 2015 - 12 - 08 Accepted all changes. Comments from the team have been
addressed and sections related to the User Data Service have
also been clarified. Added new Control Point procedures in order
to enable the indoor bike simulation feature. Comments from the
team have also been addressed in this revision.
```
```
D05r03 2016 - 02 - 24 Accepted all changes. Comments from the team have been
addressed. Data Record reference and Collector requirements
have been added.
```
```
D05r04 2016 - 03 - 10 Accepted all changes. Comments from the team have been
addressed and references have also been updated.
```
```
D05r05 2016 - 03 - 23 Accepted all changes. Comments from the team have been
addresses and updates discussed during the F2F have also been
made.
UDS Sections have been updated. Support for more than one
user is permitted and recommendations for private or public
Fitness Machine are included.
New Control Point procedures have been added (Request Control
and Spin Down Control).
```
```
D05r06 2016 - 04 - 05 Accepted all changes. Remaining comments have been
addressed and the Stop or Pause procedure of the Fitness
Machine Control Point has been updated according to the latest
changes in the Service. Document submitted for TE review.
```
```
D05r07 2016 - 04 - 12 Accepted all changes. Comments from TE have been addressed.
Document resubmitted to TE for approval.
```
```
D05r08 2016 - 04 - 13 Accepted all changes. Minor updates from TE. Document ready
for BARB review.
```
```
D05r09 2016 - 05 - 03 Accepted all changes. Comments from the BARB have been
addressed. Clarifications and improvements made to the UDS
related sections.
```
```
D05r10 2016 - 05 - 10 Comments from BARB re-review addressed.
```
```
D09r00 2016 - 05 - 26 D05r10 has been approved by BARB.
```
```
D09r01 2016 - 07 - 18 Accepted all changes. Removed reference to the Preferred Unit
System characteristic which has not yet been added to the list of
UDS Characteristics. If it is added before formal IOP of the Fitness
Machine Specification, it will be added. Set Targeted Cadence
procedure has also been added to the list of Fitness Machine
Control Point Procedure.
```

```
Revision Number Date Comments
```
```
D10r00 2016 - 10 - 18 Minor edits following IOP and contributors list has been updated.
```
```
D10r01 2017 - 02 - 06 Updated copyright notice.
```
```
V 1 .0 2017 - Feb-
14
```
```
Adopted by the Bluetooth SIG Board of Directors.
```
Contributors

```
Name Company
```
```
Ben Roscoe Saris Cycling Group
```
```
Leif Aschehoug Nordic Semiconductor
```
```
Shwetha Mahadik Mindtree
```
```
Niclas Granqvist Polar
```
```
Guillaume Schatz Polar
```
```
Meghna Lav Apple Inc.
```
```
Ernest Chiang PAFERS Tech
```
```
Paul Yeh PAFERS Tech
```

Use of this specification is your acknowledgement that you agree to and will comply with the following notices and
disclaimers. You are advised to seek appropriate legal, engineering, and other professional advice regarding the use,
interpretation, and effect of this specification.

Use of Bluetooth specifications by members of Bluetooth SIG is governed by the membership and other related
**agreements between Bluetooth SIG and its members, including those agreements posted on Bluetooth SIG’s website**
located at [http://www.bluetooth.com.](http://www.bluetooth.com.) Any use of this specification by a member that is not in compliance with the applicable
membership and other related agreements is prohibited and, among other things, may result in (i) termination of the
applicable agreements and (ii) liability for infringement of the intellectual property rights of Bluetooth SIG and its
members.

Use of this specification by anyone who is not a member of Bluetooth SIG is prohibited and is an infringement of the
intellectual property rights of Bluetooth SIG and its members. The furnishing of this specification does not grant any
**license to any intellectual property of Bluetooth SIG or its members. THIS SPECIFICATION IS PROVIDED “AS IS” AND**
BLUETOOTH SIG, ITS MEMBERS AND THEIR AFFILIATES MAKE NO REPRESENTATIONS OR WARRANTIES AND
DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING ANY WARRANTIES OF MERCHANTABILITY, TITLE,
NON-INFRINGEMENT, FITNESS FOR ANY PARTICULAR PURPOSE, OR THAT THE CONTENT OF THIS SPECIFICATION IS
FREE OF ERRORS. For the avoidance of doubt, Bluetooth SIG has not made any search or investigation as to third parties
that may claim rights in or to any specifications or any intellectual property that may be required to implement any
specifications and it disclaims any obligation or duty to do so.

TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, BLUETOOTH SIG, ITS MEMBERS AND THEIR AFFILIATES
DISCLAIM ALL LIABILITY ARISING OUT OF OR RELATING TO USE OF THIS SPECIFICATION AND ANY INFORMATION
CONTAINED IN THIS SPECIFICATION, INCLUDING LOST REVENUE, PROFITS, DATA OR PROGRAMS, OR BUSINESS
INTERRUPTION, OR FOR SPECIAL, INDIRECT, CONSEQUENTIAL, INCIDENTAL OR PUNITIVE DAMAGES, HOWEVER
CAUSED AND REGARDLESS OF THE THEORY OF LIABILITY, AND EVEN IF BLUETOOTH SIG, ITS MEMBERS OR THEIR
AFFILIATES HAVE BEEN ADVISED OF THE POSSIBILITY OF THE DAMAGES.

If this specification is a prototyping specification, it is solely for the purpose of developing and using prototypes to verify
the prototyping specifications at Bluetooth SIG sponsored IOP events. Prototyping Specifications cannot be used to
develop products for sale or distribution and prototypes cannot be qualified for distribution.

Products equipped with Bluetooth wireless technology ("Bluetooth Products") and their combination, operation, use,
implementation, and distribution may be subject to regulatory controls under the laws and regulations of numerous
countries that regulate products that use wireless non-licensed spectrum. Examples include airline regulations,
telecommunications regulations, technology transfer controls and health and safety regulations. You are solely
responsible for complying with all applicable laws and regulations and for obtaining any and all required authorizations,
permits, or licenses in connection with your use of this specification and development, manufacture, and distribution of
Bluetooth Products. Nothing in this specification provides any information or assistance in connection with complying
with applicable laws or regulations or obtaining required authorizations, permits, or licenses.

Bluetooth SIG is not required to adopt any specification or portion thereof. If this specification is not the final version
**adopted by Bluetooth SIG’s Board of Directors, it may not be adopted. Any specification adopted by Bluetooth SIG’s**
Board of Directors may be withdrawn, replaced, or modified at any time. Bluetooth SIG reserves the right to change or
alter final specifications in accordance with its membership and operating agreements.

Copyright © 2015 **–** 2017 by Bluetooth SIG, Inc. The Bluetooth word mark and logos are owned by Bluetooth SIG, Inc. All
copyrights in the Bluetooth Specifications themselves are owned by Apple Inc., Ericsson AB, Intel Corporation, Lenovo
(Singapore) Pte. Ltd., Microsoft Corporation, Nokia Corporation, and Toshiba Corporation. Other third-party brands and
names are the property of their respective owners.


## Contents


- 1 Introduction
   - 1.1 Profile Dependencies
   - 1.2 Conformance
   - 1.3 Bluetooth Specification Release Compatibility
- 2 Configuration
   - 2.1 Roles
   - 2.2 Profile – Service Relationship
   - 2.3 Concurrency Limitations/Restrictions
   - 2.4 Topology Limitations/Restrictions
   - 2.4.1 Topology Limitations/Restrictions for Low Energy
   - 2.4.2 Topology Limitations/Restrictions for BR/EDR
   - 2.5 Transport Dependencies
- 3 Fitness Machine Role Requirements
   - 3.1 Incremental Fitness Machine Service Requirements
   - 3.1.1 Additional Requirements for the Low Energy Transport
   - 3.2 Incremental User Data Service Requirements
   - 3.3 Incremental Device Information Service Requirements
- 4 Collector Role Requirements
   - 4.1 GATT Sub-Procedure Requirements..........................................................................................
   - 4.2 Service Discovery
   - 4.3 Characteristic Discovery
   - 4.3.1 Fitness Machine Characteristic Discovery
   - 4.3.2 User Data Characteristic Discovery
   - 4.3.3 Device Information Characteristic Discovery
   - 4.4 Fitness Machine Service Characteristics
   - 4.4.1 Fitness Machine Feature
   - 4.4.2 Treadmill Data
   - 4.4.3 Cross Trainer Data................................................................................................................................
   - 4.4.4 Step Climber Data.................................................................................................................................
   - 4.4.5 Stair Climber Data.................................................................................................................................
   - 4.4.6 Rower Data
   - 4.4.7 Indoor Bike Data
   - 4.4.8 Training Status
   - 4.4.9 Supported Speed Range
   - 4.4.10 Supported Inclination Range
   - 4.4.11 Supported Resistance Level Range......................................................................................................
   - 4.4.12 Supported Power Range
   - 4.4.13 Supported Heart Rate Range
   - 4.4.14 Fitness Machine Control Point
   - 4.4.15 Fitness Machine Status
   - 4.5 User Data Service Characteristics
   - 4.5.1 Database Change Increment
   - 4.5.2 User Control Point Characteristic
   - 4.5.3 Other User Data Service Characteristics
   - 4.5.4 User Data Synchronization Procedure
   - 4.6 Device Information Service Characteristics
   - 4.7 General Error Handling
   - 4.8 User Data Access Methods
- 5 Connection Establishment Procedures
   - 5.1 Fitness Machine Connection Establishment for Low Energy Transport
   - 5.1.1 Connection Procedure for Unbonded Devices
   - 5.1.2 Connection Procedure for Bonded Devices
   - 5.1.3 Link Loss Reconnection Procedure
   - 5.1.4 Use of Service Data AD Type
   - 5.2 Collector Connection Establishment for Low Energy Transport
   - 5.2.1 Link Loss Reconnection Procedure
   - 5.2.2 Use of Service Data AD Type
   - 5.3 Connection Establishment for BR/EDR
   - 5.3.1 Connection Procedure
   - 5.3.2 Link Loss Reconnection Procedure
- 6 Security Considerations
   - 6.1 Fitness Machine Security Considerations for Low Energy
   - 6.2 Collector Security Considerations for Low Energy
   - 6.3 Security Considerations for BR/EDR
- 7 Generic Access Profile for BR/EDR
   - 7.1 Modes
   - 7.2 Idle Mode Procedures
- 8 Acronyms and Abbreviations
- 9 References


## Document Terminology

The Bluetooth SIG has adopted portions of the IEEE Standards Style Manual, which dictates use of the
words **_“shall’’_** , **_“must”_** , **_“will”_** , **_“should’’_** , **_“may’’_** , and **_“can’’_** in the development of documentation, as
follows:

- The word **_“shall”_** is used to indicate mandatory requirements strictly to be followed in order to
    conform to the standard and from which no deviation is permitted (shall equals is required to).
- The use of the word **_“must”_** is deprecated and shall not be used when stating mandatory
    requirements; must is used only to describe unavoidable situations.
- The use of the word **_“will”_** is deprecated and shall not be used when stating mandatory
    requirements; will is only used in statements of fact.
- The word **_“should”_** is used to indicate that among several possibilities one is recommended as
    particularly suitable, without mentioning or excluding others; or that a certain course of action is
    preferred but not necessarily required; or that (in the negative form) a certain course of action is
    deprecated but not prohibited (should equals is recommended that).
- The word **_“may”_** is used to indicate a course of action permissible within the limits of the standard
    (may equals is permitted).
- The word **_“can”_** is used for statements of possibility and capability, whether material, physical, or
    causal (can equals is able to).


## 1 Introduction

The Fitness Machine Profile is used to enable a data collection device to obtain data from a Fitness
Machine that exposes the Fitness Machine Service. The Fitness Machine Profile may also be used to
control a Fitness Machine (e.g., set the targeted speed or set the targeted expended energy for a training
session).

The currently supported types of Fitness Machine are listed below.

1. Treadmill
2. Cross Trainer
3. Step Climber
4. Stair Climber
5. Rower
6. Indoor Bike

The Fitness Machine Profile also provides recommendations for Fitness Machines that are designed for
use in a private environment (e.g., a home) and for Fitness Machines that are designed for use in public
environments (e.g., a gym).

### 1.1 Profile Dependencies

This profile requires the Generic Attribute Profile (GATT).

### 1.2 Conformance

If conformance to this Profile is claimed, all capabilities indicated as mandatory for this Profile shall be
supported in the specified manner (process-mandatory). This also applies for all optional and conditional
capabilities for which support is indicated. All mandatory capabilities, and optional and conditional
capabilities for which support is indicated, are subject to verification as part of the Bluetooth qualification
program.

### 1.3 Bluetooth Specification Release Compatibility

This specification is compatible with any of the following:

- Bluetooth Core Specification v4.0 [2] with the Bluetooth Core Specification Supplement v5 or later [3]
- Any Bluetooth Core Specification later than v4.


## 2 Configuration

### 2.1 Roles

The profile defines two roles: Fitness Machine and Collector.

The Fitness Machine is the device that reports training-related data to a Collector. The Collector is the
device (e.g., a mobile phone) that receives the training-related data from a Fitness Machine. If supported
by the Fitness Machine, the Collector may also control the Fitness Machine (e.g., set the targeted speed
or set the targeted expended energy for a training session).

- The Fitness Machine shall be a GATT Server.
- The Collector shall be a GATT Client.

### 2.2 Profile – Service Relationship

Figure 2. 1 shows the relationships between services and the two profile roles.

Figure 2. 1 : Relationships between services and profile roles for the Fitness Machine profile

Note: Profile roles are represented by blue boxes and the services are represented by gray boxes.

A Fitness Machine instantiates the Fitness Machine Service [1] and may also expose the User Data
Service [8] and the Device Information Service [9].

### 2.3 Concurrency Limitations/Restrictions

This profile does not impose any concurrency limitations or restrictions for the Collector and the Fitness
Machine.

### 2.4 Topology Limitations/Restrictions

### 2.4.1 Topology Limitations/Restrictions for Low Energy

This section describes topology limitations and restrictions when the profile is used over Low Energy
transport.

The Fitness Machine shall use the GAP Peripheral role.

The Collector shall use the GAP Central role.


### 2.4.2 Topology Limitations/Restrictions for BR/EDR

There are no topology limitations or restrictions when the profile is used over the BR/EDR (Basic
Rate/Enhanced Data Rate) transport.

### 2.5 Transport Dependencies

There are no transport restrictions imposed by this profile specification.

Where the term BR/EDR is used in this document, it also includes the optional use of AMP.


## 3 Fitness Machine Role Requirements

The Fitness Machine shall instantiate one and only one Fitness Machine Service [1]. See specific
recommendations in Section 3.1.

The Fitness Machine Service shall be instantiated as a «Primary Service».

The User Data Service [8], if supported, shall be instantiated as a «Primary Service». See additional
requirements in Section 3.2.

The Fitness Machine may instantiate the Device Information Service [9]. See additional requirements in
Section 3.3.

```
Service Fitness Machine
```
```
Fitness Machine Service [1] M
```
```
User Data Service [8] O
```
```
Device Information Service [9] O
```
Table 3. 1 : Fitness Machine Service Requirements

In addition to the Fitness Machine requirements in this section, refer to Sections 5.1 and 6.1 for additional
Fitness Machine requirements for the low energy transport and to Sections 5.3 and 6.3 for additional
Fitness Machine requirements the BR/EDR transport.

### 3.1 Incremental Fitness Machine Service Requirements

This section describes additional requirements beyond those defined in the Fitness Machine Service.

### 3.1.1 Additional Requirements for the Low Energy Transport

This section describes additional Fitness Machine requirements beyond those defined in the Fitness
Machine Service [1] when using this profile over the low energy transport.

3.1.1.1 Service UUIDs AD Type

While in a GAP Discoverable Mode for initial connection to a Collector, the Fitness Machine should
include the Fitness Machine Service UUID (defined in [4]) in the Service UUIDs AD type field of the
advertising data. This enhances the user experience by enabling the Collector to identify a Fitness
Machine before it initiates a connection.

3.1.1.2 Local Name AD Type

For an enhanced user experience, a Fitness Machine should include the Local Name (containing either
the complete or shortened value of the Device Name characteristic as defined in [2]) in its Advertising
Data or Scan Response Data.

3.1.1.3 Writable GAP Device Name Characteristic

The Fitness Machine may support the write property for the Device Name characteristic in order to allow a
Collector to write a device name to the Fitness Machine.


3.1.1.4 Appearance AD Type

For an enhanced user experience, a Fitness Machine should include the value of the Appearance
characteristic (defined in [4]) in its Advertising data or Scan Response data.

3.1.1.5 Service Data AD Type

In order to facilitate the connection between a Fitness Machine and a Collector, a Fitness Machine should
support the Service Data AD Type.

When the Fitness Machine is using Connectable Undirected Advertising, it should include the Service
Data AD Type in its Advertising Data to reduce unwanted connection requests by unintended Collectors.

The Service Data payload (defined in [1]) includes a Flags field and a Fitness Machine Type field.

See Sections 5.1.4 and 5.2.2 for additional requirements.

### 3.2 Incremental User Data Service Requirements

This section describes additional requirements beyond those defined in the User Data Service [8].

A Fitness Machine should expose the UDS characteristics defined in Table 3. 2.

```
UDS Characteristic Requirement
```
```
First Name O
```
```
Weight O
```
```
Gender O
```
```
Height O
```
```
Age O
```
```
Date of Birth O
```
```
Heart Rate Max O
```
```
Resting Heart Rate O
```
```
Maximum Recommended Heart Rate O
```
```
VO 2 Max O
```
```
Language O
```
```
Two Zone Heart Rate Limits O
```
```
Three Zone Heart Rate Limits O
```
```
Five Zone Heart Rate Limits O
```
Table 3. 2 : User Data Service Requirements


If the Date of Birth characteristic exists in the User Data Service, a value of 0 for Year shall not be used,
but a value of 0 for Month and Day may be used for privacy reasons.

A Fitness Machine designed for use in a private environment (e.g. a home) should support the User Data
Retention feature defined in [1], and therefore, the support for multiple users should also be supported. In
this case, the Fitness Machine shall store the user data for each supported user for a later use, as
defined in [8].

A Fitness Machine designed for use in a public environment (e.g. a gym) should not support the User
Data Retention feature defined in [1]. This recommendation is applicable in any situation where privacy
issues require that the user’s data not be stored in the equipment after the user has completed the
training session.

For both types of Fitness Machine, when the user data is deleted (e.g. either with the Delete User Data
procedure defined in Section 4.5.2.2.3 or after a disconnection), the UDS characteristics exposed by the
Fitness Machine shall be set to their default values, and the User Index characteristic shall be set to
0xFF.

If two or more Collectors are connected to the same Fitness Machine, refer to [8], Section 1.5.1, for
requirements on how to handle this situation.

If a user has configured the Fitness Machine with their user data (for example, via the UI of the Fitness
Machine) before a connection is established, and if a Collector initiates a connection and attempts to
access the user data (see Section 4.8), the user should be prompted (via the UI of the Fitness Machine)
to select the source of the user data for the Fitness Machine to use.

### 3.3 Incremental Device Information Service Requirements

This section describes additional requirements beyond those defined in the Device Information Service
[9].

In order to allow the Collector to log the type of equipment used in a training session, the Fitness Machine
should instantiate the Device Information Service characteristics defined in Table 3. 3.

```
Device Information Service Characteristic Requirement
```
```
Manufacturer Name String O
```
```
Model Number String O
```
Table 3. 3 : Device Information Service Requirements


## 4 Collector Role Requirements

The Collector shall support the Fitness Machine Service [1].

The Collector should support the User Data Service [8] as well as Device Information Service [9].

```
Profile Requirement Section Support in Collector
```
```
Service Discovery 4.2 M
```
```
 Fitness Machine Service [1] Discovery 4.2^ M^
```
```
 User Data Service [8] Discovery 4.2^ O^
```
```
 Device Information Service [9] Discovery 4.2^ O^
```
```
Characteristic Discovery 4.3 M
```
```
 Fitness Machine Service [1] Characteristic Discovery 4.3.1^ M^
```
```
 User Data Service [8] Characteristic Discovery 4.3.2 O
```
```
 Device Information Service [9] Characteristic Discovery 4.3.3^ O^
```
Table 4. 1 : Profile Requirements for the Collector Role

### 4.1 GATT Sub-Procedure Requirements..........................................................................................

This section describes a minimum set of requirements for a Collector. Other GATT sub-procedures may
be used if supported by both Client and Server.

The table below summarizes additional GATT sub-procedure requirements beyond those required by all
GATT Clients.

```
GATT Sub-Procedure Collector Requirements
```
```
Discover All Primary Services C.
```
```
Discover Primary Services by Service UUID C.
```
```
Discover All Characteristics of a Service C.
```
```
Discover Characteristics by UUID C.
```
```
Discover All Characteristic Descriptors M
```
```
Read Characteristic Value M
```
```
Read Long Characteristic Values M
```
```
Write Characteristic Value C.
```
```
Write Long Characteristic Values C.
```

```
GATT Sub-Procedure Collector Requirements
```
```
Read Characteristic Descriptors M
```
```
Write Characteristic Descriptors M
```
Table 4. 2 : Additional GATT Sub-Procedure Requirements

C.1: Mandatory to support at least one of these Service Discovery sub-procedures when using the LE
transport. Excluded when using the BR/EDR transport, because the Service Discovery Protocol
(SDP) must be used in this case.
C.2: Mandatory to support at least one of these Characteristic Discovery sub-procedures.
C.3: Mandatory if the writing of UDS characteristics or the GAP Device Name characteristic is supported
(see Section 3.1.1.3).
C.4: Mandatory if the Collector writes UDS characteristics, over the low energy feature of Bluetooth that
are UTF8 strings; otherwise Optional.

### 4.2 Service Discovery

When using the Low Energy transport, the Collector shall perform primary service discovery using either
the GATT Discover All Primary Services sub-procedure or the GATT Discover Primary Services by
Service UUID sub-procedure.

The Collector shall discover the Fitness Machine Service and may also attempt to discover the User Data
Service and the Device Information Service.

When using the BR/EDR transport, the Collector shall initiate service discovery by retrieving the SDP
record of the Fitness Machine Service as defined in [1].

### 4.3 Characteristic Discovery

As required by GATT, the Client/Collector must be tolerant of additional optional characteristics in the
service records of services used with this profile.

Where a characteristic is discovered that can be indicated or notified, the Collector shall also discover the
associated Client Characteristic Configuration descriptor.

### 4.3.1 Fitness Machine Characteristic Discovery

The Collector shall use either the GATT Discover All Characteristics of a Service sub-procedure or the
GATT Discover Characteristics by UUID sub-procedure to discover the characteristics of the service.

The Collector shall use the GATT Discover All Characteristic Descriptors sub-procedure to discover the
characteristic descriptors.

The discovery requirements for the Collector are shown in Table 4. 3.

```
Characteristics Discovery Requirements for Collector
```
```
Fitness Machine Feature M
```
```
Treadmill Data O
```
```
Cross Trainer Data O
```

```
Characteristics Discovery Requirements for Collector
```
```
Step Climber Data O
```
```
Stair Climber Data O
```
```
Rower Data O
```
```
Indoor Bike Data O
```
```
Training Status M
```
```
Supported Speed Range O
```
```
Supported Inclination Range O
```
```
Supported Resistance Level Range O
```
```
Supported Power Range O
```
```
Supported Heart Rate Range O
```
```
Fitness Machine Control Point O
```
```
Fitness Machine Status O
```
Table 4. 3 : Discovery Requirements for the Collector

### 4.3.2 User Data Characteristic Discovery

If the Collector supports the User Data Service, the Collector shall discover the characteristics of the User
Data Service.

In order for the Collector to discover the characteristics of the User Data Service, it shall use either the
GATT Discover All Characteristics of a Service sub-procedure or the GATT Discover Characteristics by
UUID sub-procedure to discover all characteristics of this service.

If the Collector supports the User Data Service, the requirements for the Collector are shown in Table 4. 4.

```
Characteristics Discovery Requirements for Collector
```
```
Database Change Increment M
```
```
User Data Control Point M
```
```
User Index M
```
```
First Name O
```
```
Weight O
```
```
Gender O
```
```
Height O
```

```
Characteristics Discovery Requirements for Collector
```
```
Age O
```
```
Date of Birth O
```
```
Heart Rate Max O
```
```
Resting Heart Rate O
```
```
Maximum Recommended Heart Rate O
```
```
VO 2 Max O
```
```
Language O
```
```
Other UDS Characteristics O
```
Table 4. 4 : Discovery Requirements for a Collector That Supports the User Data Service

Table 4. 4 includes some common optional User Data Service characteristics in the context of the Fitness
Machine Profile, but other User Data Service characteristics, not listed here, may also be used.

### 4.3.3 Device Information Characteristic Discovery

The Collector may discover the characteristics of the Device Information Service.

In order for the Collector to discover the characteristics of the Device Information Service, it shall use
either the GATT Discover All Characteristics of a Service sub-procedure or the GATT Discover
Characteristics by UUID sub-procedure to discover all characteristics of this service.

### 4.4 Fitness Machine Service Characteristics

### 4.4.1 Fitness Machine Feature

The Collector shall read the Fitness Machine Feature characteristic to determine the supported features
of the Fitness Machine in order to understand its capabilities.

In many cases, this will allow the Collector to adapt to the supported features of the Fitness Machine (for
example, unsupported features will not be shown on the UI of the Collector) as defined in [1]. If one of the
features bit is set to 1 (meaning this feature is supported), the Collector shall assume that the related bits
of the Flags fields are used by the Fitness Machine and the associated value might be shown on the UI of
the Collector. Otherwise, it is unnecessary for the Collector to expect a value related to an unsupported
feature.

If the Collector reads a Fitness Machine Feature characteristic with Reserved for Future Use (RFU) bits
that are non-zero, the Collector shall ignore those bits and continue to process the Fitness Machine
Feature characteristic in the same way as if all the RFU bits had been zero. This is to enable compatibility
with future Fitness Machine Service updates.

### 4.4.2 Treadmill Data

The Collector shall configure notifications of the Treadmill Data characteristic (i.e. via the Client
Characteristic Configuration descriptor).


The Collector shall be able to receive multiple notifications of the Treadmill Data characteristic from a
Fitness Machine for the case where the Fitness Machine has training-related data to send (typically
during a training session).

The Collector shall determine the contents of the Treadmill Data characteristic based on the contents of
the Flags field. This allows the Collector to determine whether or not the optional fields are present.

For low energy devices, and as defined in [1], a Data Record may be split and transmitted in multiple
notifications if the payload exceeds the ATT_MTU size; therefore, the Collector shall be able to handle
Data Records that are sent in one or more notifications. This requirement does not affect BR/EDR
devices.

If the Collector receives a Treadmill Data characteristic with Reserved for Future Use (RFU) bits of the
Flags field that are non-zero, the Collector shall ignore those bits and any additional data that the packet
contains and continue to process the Treadmill Data characteristic in the same way as if all the RFU bits
had been zero.

If the Collector receives a Treadmill Data characteristic with additional unrecognized octets, the Collector
shall ignore the unrecognized octets. This is to enable compatibility with future service updates for the
case where available octets in the characteristic are specified for optional use.

The Collector shall be tolerant and behave appropriately (i.e., the Collector shall be able to continue to
process commands and/or receive data normally) if receiving the special values for optional fields
meaning “Data Not Available”, as defined in the Fitness Machine Service [1].

### 4.4.3 Cross Trainer Data................................................................................................................................

The Collector shall configure notifications of the Cross Trainer Data characteristic (i.e., via the Client
Characteristic Configuration descriptor).

The Collector shall be able to receive multiple notifications of the Cross Trainer Data characteristic from a
Fitness Machine for the case where the Fitness Machine has training-related data to send (typically
during a training session).

The Collector shall determine the contents of the Cross Trainer Data characteristic based on the contents
of the Flags field. This allows the Collector to determine whether or not the optional fields are present.

For low energy devices, and as defined in [1], a Data Record may be split and transmitted in multiple
notifications if the payload exceeds the ATT_MTU size; therefore, the Collector shall be able to handle
Data Records that are sent in one or more notifications. This requirement does not affect BR/EDR
devices.

If the Collector receives a Cross Trainer Data characteristic with Reserved for Future Use (RFU) bits of
the Flags field that are non-zero, it shall ignore those bits and any additional data that the packet contains
and continue to process the Cross Trainer Data characteristic in the same way as if all the RFU bits are
zero.

If the Collector receives a Cross Trainer Data characteristic with additional unrecognized octets, the
Collector shall ignore the unrecognized octets. This is to enable compatibility with future service updates
for the case where available octets in the characteristic are specified for optional use.


The Collector shall be tolerant and behave appropriately (that is, the Collector shall be able to continue to
process commands and/or receive data normally) if receiving the special values for optional fields
meaning “Data Not Available”, as defined in the Fitness Machine Service [1].

### 4.4.4 Step Climber Data.................................................................................................................................

The Collector shall configure notifications of the Step Climber Data characteristic (i.e. via the Client
Characteristic Configuration descriptor).

The Collector shall be able to receive multiple notifications of the Step Climber Data characteristic from a
Fitness Machine for the case where the Fitness Machine has training-related data to send (typically
during a training session).

The Collector shall determine the contents of the Step Climber Data characteristic based on the contents
of the Flags field. This allows the Collector to determine whether or not the optional fields are present.

For low energy devices, and as defined in [1], a Data Record may be split and transmitted in multiple
notifications if the payload exceeds the ATT_MTU size; therefore, the Collector shall be able to handle
Data Records that are sent in one or more notifications. This requirement does not affect BR/EDR
devices.

If the Collector receives a Step Climber Data characteristic with Reserved for Future Use (RFU) bits of the
Flags field that are non-zero, the Collector shall ignore those bits and any additional data that the packet
contains and continue to process the Step Climber Data characteristic in the same way as if all the RFU
bits had been zero.

If the Collector receives a Step Climber Data characteristic with additional unrecognized octets, the
Collector shall ignore the unrecognized octets. This is to enable compatibility with future service updates
for the case where available octets in the characteristic are specified for optional use.

The Collector shall be tolerant and behave appropriately (that is, the Collector shall be able to continue to
process commands and/or receive data normally) if receiving the special values for optional fields
meaning ”Data Not Available”, as defined in the Fitness Machine Service [1].

### 4.4.5 Stair Climber Data.................................................................................................................................

The Collector shall configure notifications of the Stair Climber Data characteristic (i.e. via the Client
Characteristic Configuration descriptor).

The Collector shall be able to receive multiple notifications of the Stair Climber Data characteristic from a
Fitness Machine for the case where the Fitness Machine has training-related data to send (typically
during a training session).

The Collector shall determine the contents of the Stair Climber Data characteristic based on the contents
of the Flags field. This allows the Collector to determine whether or not the optional fields are present.

For low energy devices, and as defined in [1], a Data Record may be split and transmitted in multiple
notifications if the payload exceeds the ATT_MTU size; therefore, the Collector shall be able to handle
data records that are sent in one or more notifications. This requirement does not affect BR/EDR devices.

If the Collector receives a Stair Climber Data characteristic with Reserved for Future Use (RFU) bits of the
Flags field that are non-zero, the Collector shall ignore those bits and any additional data that the packet


contains and continue to process the Stair Climber Data characteristic in the same way as if all the RFU
bits had been zero.

If the Collector receives a Stair Climber Data characteristic with additional unrecognized octets, the
Collector shall ignore the unrecognized octets. This is to enable compatibility with future service updates
for the case where available octets in the characteristic are specified for optional use.

The Collector shall be tolerant and behave appropriately (that is, the Collector shall be able to continue to
process commands and/or receive data normally) if receiving the special values for optional fields
meaning “Data Not Available”, as defined in the Fitness Machine Service [1].

### 4.4.6 Rower Data

The Collector shall configure notifications of the Rower Data characteristic (i.e., via the Client
Characteristic Configuration descriptor).

The Collector shall be able to receive multiple notifications of the Rower Data characteristic from a
Fitness Machine for the case where the Fitness Machine has training-related data to send (typically
during a training session).

The Collector shall determine the contents of the Rower Data characteristic based on the contents of the
Flags field. This allows the Collector to determine whether or not the optional fields are present.

For low energy devices, and as defined in [1], a Data Record may be split and transmitted in multiple
notifications if the payload exceeds the ATT_MTU size; therefore, the Collector shall be able to handle
Data Records that are sent in one or more notifications. This requirement does not affect BR/EDR
devices.

If the Collector receives a Rower Data characteristic with Reserved for Future Use (RFU) bits of the Flags
field that are non-zero, it shall ignore those bits and any additional data that the packet contains and
continue to process the Rower Data characteristic in the same way as if all the RFU bits had been zero.

If the Collector receives a Rower Data characteristic with additional unrecognized octets, the Collector
shall ignore the unrecognized octets. This is to enable compatibility with future service updates for the
case where available octets in the characteristic are specified for optional use.

The Collector shall be tolerant and behave appropriately (that is, the Collector shall be able to continue to
process commands and/or receive data normally) if receiving the special values for optional fields
meaning “Data Not Available”, as defined in the Fitness Machine Service [1].

### 4.4.7 Indoor Bike Data

The Collector shall configure notifications of the Indoor Bike Data characteristic (i.e., via the Client
Characteristic Configuration descriptor).

The Collector shall be able to receive multiple notifications of the Indoor Bike Data characteristic from a
Fitness Machine for the case where the Fitness Machine has training-related data to send (typically
during a training session).

The Collector shall determine the contents of the Indoor Bike Data characteristic based on the contents of
the Flags field. This allows the Collector to determine whether or not the optional fields are present.


For low energy devices, and as defined in [1], a Data Record may be split and transmitted in multiple
notifications if the payload exceeds the ATT_MTU size; therefore, the Collector shall be able to handle
data records that are sent in one or more notifications. This requirement does not affect BR/EDR devices.

If the Collector receives an Indoor Bike Data characteristic with Reserved for Future Use (RFU) bits of the
Flags field that are non-zero, the Collector shall ignore those bits and any additional data that the packet
contains and continue to process the Indoor Bike Data characteristic in the same way as if all the RFU
bits had been zero.

If the Collector receives an Indoor Bike Data characteristic with additional unrecognized octets, the
Collector shall ignore the unrecognized octets. This is to enable compatibility with future service updates
for the case where available octets in the characteristic are specified for optional use.

The Collector shall be tolerant and behave appropriately (i.e. the Collector shall be able to continue to
process commands and/or receive data normally) if receiving the special values for optional fields
meaning “Data Not Available”, as defined in the Fitness Machine Service [1].

### 4.4.8 Training Status

The Collector should configure notifications of the Training Status characteristic (i.e. via the Client
Characteristic Configuration descriptor).

The Collector shall be able to receive multiple notifications of the Training Status characteristic from a
Fitness Machine for the case where the Fitness Machine has training status-related data to send (e.g.
typically during a training session).

The Collector shall determine the contents of the Training Status characteristic based on the contents of
the Flags field. This allows the Collector to determine whether or not the optional fields are present.

If the Extended String bit of the Flags field is set to 1, meaning that the Training Status String exceeds the
maximum size that can be transmitted in a notification, the Collector should use the GATT Read Long
procedure to retrieve the remaining octets of this characteristic.

If the Collector receives a Training Status characteristic with Reserved for Future Use (RFU) bits of the
Flags field that are non-zero, it shall ignore those bits and any additional data that the packet contains
and continue to process the Training Status characteristic in the same way as if all the RFU bits had been
zero.

If the Collector receives a Training Status characteristic with additional unrecognized octets, the Collector
shall ignore the unrecognized octets. This is to enable compatibility with future service updates for the
case where available octets in the characteristic are specified for optional use.

### 4.4.9 Supported Speed Range

The Collector should read the Supported Speed Range characteristic in order to determine the minimum
and maximum speed values that can be used to set the target speed of the Fitness Machine (using the
Set Target Speed of the Fitness Machine Control Point defined i n Section 4.4.14.2.3).

### 4.4.10 Supported Inclination Range

The Collector should read the Supported Inclination Range characteristic in order to determine the
minimum and maximum inclination values that can be used to set the target inclination of the Fitness


Machine (i.e., using the Set Target Inclination of the Fitness Machine Control Point defined in
Section 4.4.14.2.4).

### 4.4.11 Supported Resistance Level Range......................................................................................................

The Collector should read the Supported Resistance Level Range characteristic in order to determine the
minimum and maximum resistance level values that can be used to set the target resistance level of the
Fitness Machine (i.e., using the Set Target Resistance Level of the Fitness Machine Control Point defined
in Section 4.4.14.2.5).

### 4.4.12 Supported Power Range

The Collector should read the Supported Power Range characteristic in order to determine the minimum
and maximum power values that can be used to set the target power of the Fitness Machine (i.e., using
the Set Target Power of the Fitness Machine Control Point defined in Section 4.4.14.2.6).

### 4.4.13 Supported Heart Rate Range

The Collector should read the Supported Heart Rate Range characteristic in order to determine the
minimum and maximum heart rate values that can be used to set the target heart rate of the Fitness
Machine (i.e. using the Set Target Heart Rate of the Fitness Machine Control Point defined in
Section 4.4.14.2.7).

### 4.4.14 Fitness Machine Control Point

Before it performs a Fitness Machine Control Point procedure, the Collector shall configure the Fitness
Machine Control Point characteristic for indications (i.e., via the Client Characteristic Configuration
descriptor).

In order to perform any of the supported control procedures, the Collector shall request the control of the
Fitness Machine by using the Request Control procedure defined in Section 4.4.14.2.1.

If the Request Control procedure succeeds, the Collector may perform a write to the Fitness Machine
Control Point to request a desired procedure. A procedure begins when the Collector writes a particular
Op Code to the Fitness Machine Control Point to perform some desired action, and the procedure ends
when the Collector sends a confirmation to acknowledge the Fitness Machine Control Point indication
sent by the Fitness Machine at the end of the procedure. This indication includes: the Response Code,
the Requested Op Code, and the Response Value as defined in [1]. Otherwise, the control is not
permitted, and the Fitness Machine will respond to any requests from the Collector with the appropriate
error response.

4.4.14.1 Fitness Machine Control Point Procedure Requirements

Table 4. 5 shows the requirements for the Fitness Machine Control Point procedures (Op Codes) in the
context of this profile.

```
Procedure (Op Code) Requirement
```
```
Request Control M
```
```
Reset M
```
```
Set Target Speed O
```

```
Procedure (Op Code) Requirement
```
```
Set Target Inclination O
```
```
Set Target Resistance Level O
```
```
Set Target Power O
```
```
Set Target Heart Rate O
```
```
Start or Resume O
```
```
Stop or Pause O
```
```
Set Targeted Expended Energy O
```
```
Set Targeted Number of Steps O
```
```
Set Targeted Number of Stride O
```
```
Set Targeted Distance O
```
```
Set Targeted Training Time O
```
```
Set Targeted Time in Two Heart Rate Zones O
```
```
Set Targeted Time in Three Heart Rate Zones O
```
```
Set Targeted Time in Five Heart Rate Zones O
```
```
Set Indoor Bike Simulation Parameters O
```
```
Set Wheel Circumference O
```
```
Spin Down Control O
```
```
Set Targeted Cadence O
```
Table 4. 5 : Fitness Machine Control Point Procedure Requirements for the Collector

4.4.14.2 Fitness Machine Control Point Behavioral Description

The Collector shall write to the Fitness Machine Control Point characteristic using one of the supported
Op Codes in Table 4. 5 to request that a Fitness Machine perform a procedure. This may include a
parameter that is valid within the context of that Op Code, as defined in [1].

4.4.14.2.1 Request Control Procedure

To request the control of the Fitness Machine (i.e. to use the Fitness Machine Control Point procedures
defined in Section 4.4.14.2.2–4.4.14.2.20), the Collector shall use the Request Control Op Code, as
defined in [1].

The Collector shall wait for the Fitness Machine Control Point Indication with the Response Value set to
Success, indicating successful operation, an error response value as described in Section 4.7, or the
procedure to time out according to the procedure time-out operation described in Section 4.4.14.3.


Note that the control is permitted after the Request Control procedure succeeds until a disconnection
occurs or until the Fitness Machine Status characteristic is notified by the Fitness Machine with the Op
Code value set to Control Permission Lost (0xFF).

4.4.14.2.2 Reset Procedure

To reset the Fitness Machine, the Collector shall use the Reset Op Code, as defined in [1].

The Collector shall wait for the Fitness Machine Control Point Indication with the Response Value set to
Success, indicating successful operation, an error response value as described in Section 4.7, or the
procedure to time out according to the procedure time-out operation described in Section 4.4.14.3.

4.4.14.2.3 Set Target Speed Procedure

To set the target speed of a Fitness Machine, the Collector shall use the Set Target Speed Op Code
followed by an UINT16 parameter value that represents the Target Speed as defined in [1].

The Collector shall wait for the Fitness Machine Control Point Indication with the Response Value set to
Success, indicating successful operation, an error response value as described in Section 4.7, or the
procedure to time out according to the procedure time-out operation described in Section 4.4.14.3.

4.4.14.2.4 Set Target Inclination Procedure

To set the target inclination of a Fitness Machine, the Collector shall use the Set Target Inclination
Op Code followed by an SINT16 parameter value that represents the Target Inclination as defined in [1].

The Collector shall wait for the Fitness Machine Control Point Indication with the Response Value set to
Success, indicating successful operation, an error response value as described in Section 4.7, or the
procedure to time out according to the procedure time-out operation described in Section 4 .4.14.3.

4.4.14.2.5 Set Target Resistance Level Procedure

To set the target resistance level of a Fitness Machine, the Collector shall use the Set Target Resistance
Level Op Code followed by an UINT8 parameter value that represents the Target Resistance Level as
defined in [1].

The Collector shall wait for the Fitness Machine Control Point Indication with the Response Value set to
Success, indicating successful operation, an error response value as described in Section 4.7, or the
procedure to time out according to the procedure time-out operation described in Section 4.4.14.3.

4.4.14.2.6 Set Target Power Procedure

To set the target power of a Fitness Machine, the Collector shall use the Set Target Power Op Code
followed by an SINT16 parameter value that represents the Target Power as defined in [1].

The Collector shall wait for the Fitness Machine Control Point Indication with the Response Value set to
Success, indicating successful operation, an error response value as described in Section 4.7, or the
procedure to time out according to the procedure time-out operation described in Section 4.4.14.3.

See Section 4.7 for general error handling procedures.

4.4.14.2.7 Set Target Heart Rate Procedure

To set the target heart rate of a Fitness Machine, the Collector shall use the Set Target Heart Rate
Op Code followed by aUINT8 parameter value that represents the Target Heart Rate as defined in [1].


The Collector shall wait for the Fitness Machine Control Point Indication with the Response Value set to
Success, indicating successful operation, an error response value as described in Section 4.7, or the
procedure to time out according to the procedure time-out operation described in Section 4.4.14.3.

4.4.14.2.8 Start or Resume Procedure

To start (or resume) the Fitness Machine, the Collector shall use the Start or Resume Op Code, as
defined in [1].

The Collector shall wait for the Fitness Machine Control Point Indication with the Response Value set to
Success, indicating successful operation, an error response value as described in Section 4.7, or the
procedure to time out according to the procedure time-out operation described in Section 4.4.14.3.

4.4.14.2.9 Stop or Pause Procedure

To stop (or pause) the Fitness Machine, the Collector shall use the Stop or Pause Op Code followed by a
UINT8 parameter value that represents the Control Information (i.e., whether a stop or a pause command
is requested), as defined in [1].

The Collector shall wait for the Fitness Machine Control Point Indication with the Response Value set to
Success, indicating successful operation, an error response value as described in Section 4.7, or the
procedure to time out according to the procedure time-out operation described in Section 4.4.14.3.

4.4.14.2.10 Set Targeted Expended Energy Procedure

To set the targeted expended energy for a training session, the Collector shall use the Set Targeted
Expended Energy Op Code followed by a UINT16 parameter value that represents the Targeted
Expended Energy as defined in [1].

The Collector shall wait for the Fitness Machine Control Point Indication with the Response Value set to
Success, indicating successful operation, an error response value as described in Section 4.7, or the
procedure to time out according to the procedure time-out operation described in Section 4.4.14.3.

4.4.14.2.11 Set Targeted Number of Steps Procedure

To set the targeted number of steps for a training session, the Collector shall use the Set Targeted
Number of Steps Op Code followed by a UINT16 parameter value that represents the Targeted Number
of Steps as defined in [1].

The Collector shall wait for the Fitness Machine Control Point Indication with the Response Value set to
Success, indicating successful operation, an error response value as described in Section 4.7, or the
procedure to time out according to the procedure time-out operation described in Section 4.4.14.3.

4.4.14.2.12 Set Targeted Number of Strides Procedure

To set the targeted number of strides for a training session, the Collector shall use the Set Targeted
Number of Strides Op Code followed by a UINT16 parameter value that represents the Targeted Number
of Strides as defined in [1].

The Collector shall wait for the Fitness Machine Control Point Indication with the Response Value set to
Success, indicating successful operation, an error response value as described in Section 4.7, or the
procedure to time out according to the procedure time-out operation described in Section 4.4.14.3.


4.4.14.2.13 Set Targeted Distance Procedure

To set the targeted distance for a training session, the Collector shall use the Set Targeted Distance
Op Code followed by a UINT24 parameter value that represents the Targeted Distance as defined in [1].

The Collector shall wait for the Fitness Machine Control Point Indication with the Response Value set to
Success, indicating successful operation, an error response value as described in Section 4.7, or the
procedure to time out according to the procedure time-out operation described in Section 4.5.2.3.

4.4.14.2.14 Set Targeted Training Time Procedure

To set the targeted training time for a training session, the Collector shall use the Set Targeted Training
Time Op Code followed by a UINT16 parameter value that represents the Targeted Training Time as
defined in [1].

The Collector shall wait for the Fitness Machine Control Point Indication with the Response Value set to
Success, indicating successful operation, an error response value as described in Section 4.7, or the
procedure to time out according to the procedure time-out operation described in Section 4.4.14.3.

4.4.14.2.15 Set Targeted Time in Two Heart Rate Zones Procedure

To set the targeted time in two heart rate zones for a training session, the Collector shall use the Set
Targeted Time in Two Heart Rate Zones Op Code followed by two UINT16 parameter values that
represent the Targeted Time in each heart rate zone, as defined in [1].

The Collector shall wait for the Fitness Machine Control Point Indication with the Response Value set to
Success, indicating successful operation, an error response value as described in Section 4.7, or the
procedure to time out according to the procedure time-out operation described in Section 4.4.14.3.

4.4.14.2.16 Set Targeted Time in Three Heart Rate Zones Procedure

To set the targeted time in three heart rate zones for a training session, the Collector shall use the Set
Targeted Time in Three Heart Rate Zones Op Code followed by three UINT16 parameter values that
represent the Targeted Time in each heart rate zone, as defined in [1].

The Collector shall wait for the Fitness Machine Control Point Indication with the Response Value set to
Success, indicating successful operation, an error response value as described in Section 4.7, or the
procedure to time out according to the procedure time-out operation described in Section 4.4.14.3.

4.4.14.2.17 Set Targeted Time in Five Heart Rate Zones Procedure

To set the targeted time in five heart rate zones for a training session, the Collector shall use the Set
Targeted Time in Five Heart Rate Zones Op Code followed by five UINT16 parameter values that
represent the Targeted Time in each heart rate zone, as defined in [1].

The Collector shall wait for the Fitness Machine Control Point Indication with the Response Value set to
Success, indicating successful operation, an error response value as described in Section 4.7, or the
procedure to time out according to the procedure time-out operation described in Section 4.4.14.3.

4.4.14.2.18 Set Indoor Bike Simulation Parameters

To set the indoor bike simulation parameters during a training session (wind speed, grade, coefficient of
rolling resistance, and wind resistance coefficient), the Collector shall use the Set Indoor Bike Simulation
Parameter Op Code followed by the Wind Speed, Grade, Coefficient of Rolling Resistance (Crr), and
Wind Resistance Coefficient (Cw) parameters, as defined in [1].


The Collector shall wait for the Fitness Machine Control Point Indication with the Response Value set to
Success, indicating successful operation, an error response value as described in Section 4.7, or the
procedure to time out according to the procedure time-out operation described in Section 4.4.14.3.

4.4.14.2.19 Set Wheel Circumference

To set the wheel circumference of the indoor bike (typically used for bike simulation), the Collector shall
use the Set Wheel Circumference Op Code followed by the UINT16 parameter that represents the Wheel
Circumference parameter, as defined in [1].

The Collector shall wait for the Fitness Machine Control Point Indication with the Response Value set to
Success, indicating successful operation, an error response value as described in Section 4.7, or the
procedure to time out according to the procedure time-out operation described in Section 4.5.2.3.

4.4.14.2.20 Spin Down Control

To control the spin down procedure, the Collector shall use the Spin Down Control Op Code followed by
the UINT8 parameter that represents the Control Parameter, as defined in [1].

The Collector shall wait for the Fitness Machine Control Point Indication with the Response Value set to
Success, indicating successful operation, an error response value as described in Section 4.7, or the
procedure to time out according to the procedure time-out operation described in Section 4.5.2.3.

If the Spin Down Control procedure succeeds with the Control Parameter value set to Start, the Collector
should use the parameters received along with the success response in order to provide guidance to the
user for the spin down procedure.

If the Collector receives a spin down request from the Fitness Machine (a Fitness Machine Status
notification with the Op Code 0x13 followed by the Spin Down Status value set to 0x01), the Collector
may either ignore the request or initiate the spin down procedure, as defined in [1].

4.4.14.2.21 Set Targeted Cadence Procedure

To set the targeted cadence for a training session, the Collector shall use the Set Targeted Cadence
Op Code followed by a UINT16 parameter value that represents the Targeted Cadence as defined in [1].

The Collector shall wait for the Fitness Machine Control Point Indication with the Response Value set to
Success, indicating successful operation, an error response value as described in Section 4.7, or the
procedure to time out according to the procedure time-out operation described in Section 4.5.2.3.

4.4.14.3 Procedure Timeout

In the context of the Fitness Machine Control Point characteristic, a procedure is started when the
Collector writes a particular Op Code to the Fitness Machine Control Point to perform some desired action
and ends when the Collector sends a confirmation to acknowledge the Fitness Machine Control Point
indication sent by the Fitness Machine at the end of the procedure with the Op Code set to Response
Code.

In the context of the Fitness Machine Control Point characteristic, a procedure is not considered started
and not queued in the Fitness Machine when a write to the Fitness Machine Control Point results in an
ATT Error Response.


A procedure is considered to have timed out if a Fitness Machine Control Point indication is not received
within the ATT transaction timeout, defined as 30 seconds in [2] Volume 2, Part F, Section 3.3.3, from the
start of the procedure.

If the link is lost while a Fitness Machine Control Point procedure is in progress, then the procedure shall
be considered to have timed out.

Thus, a Collector shall start a timer with the value set to the ATT transaction timeout after the write
response is received from the Fitness Machine. The timer shall be stopped when a Fitness Machine
Control Point indication is received and the Op Code is set to Response Code. If the timer expires, then
the procedure shall be considered to have failed.

If a Fitness Machine Control Point procedure times out, then no new Fitness Machine Control Point
procedure shall be started by the Collector until a new link is established with the Fitness Machine. To
ensure a good user experience, if a Fitness Machine Control Point procedure times out, the Collector
should disconnect and then reconnect.

### 4.4.15 Fitness Machine Status

The Collector should configure notifications of the Fitness Machine Status characteristic (i.e. via the Client
Characteristic Configuration descriptor).

The Collector shall be able to receive multiple notifications of the Fitness Machine Status characteristic
from a Fitness Machine for the case where the Fitness Machine has status-related data to send (typically
during a training session).

The Collector shall be able to decode the Parameter field of the Fitness Machine Status, if present, as
defined in [1].

### 4.5 User Data Service Characteristics

The Collector may read and write the value of User Data Service characteristics. Note that for UDS
characteristics that may exceed the negotiated ATT_MTU size (e.g., UTF8-based characteristics), the
Collector should use the GATT Read Long Characteristic Value and GATT Write Long Characteristic
Value sub-procedures, respectively.

If the Fitness Machine does not support the User Data Retention feature, the Collector shall use the
Register New User procedure defined in Section 4.5.2.2.1, along with a Consent Code defined by the
user (or automatically generated by the Collector) in order to write the User Data characteristics each time
a connection is established.

If the Fitness Machine supports the User Data Retention feature, when the Collector initiates a connection
to a known Fitness Machine, the Collector should use the Consent procedure defined in Section
4.5.2.2.2, along with the Consent Code defined during the registration procedure, in order to read or write
the User Data characteristics.

Refer to Section 4.8 for more information about the user data access methods.

### 4.5.1 Database Change Increment

This characteristic is used to perform synchronization functions (e.g., if the Fitness Machine allows the
user to update his data through its UI, the Collector will be informed of this update).


If supported by the Fitness Machine, the Collector shall configure notifications of the Database Change
Increment characteristic (i.e., via the Client Characteristic Configuration descriptor) in order to enable the
User Data Synchronization procedure defined in Section 4.5.4.

If the Collector receives a notification of the Database Change Increment characteristic, this is designed
to alert the Collector that a change to at least one of the values has occurred and the Collector should
read the UDS characteristic values that it supports.

After the Collector has completed writing to UDS characteristics, the Collector shall write an incremented
value to the Database Change Increment characteristic (i.e., the Collector shall increment the current
value by 1).

The Collector may read the Database Change Increment characteristic to determine whether or not the
value cached in the Collector is equal to, greater than, or less than the value in the Fitness Machine.

A rollover of the value of the Database Change Increment characteristic is extremely unlikely over the life
of the device, but if a rollover occurs, this can be handled in an implementation specific way (e.g., the
implementation can ask the user to confirm the values via the UI).

Refer to Section 4.8 for more information on the user data access methods.

### 4.5.2 User Control Point Characteristic

Before performing a User Control Point procedure, the Collector shall configure the User Control Point
characteristic for indications (i.e., via the Client Characteristic Configuration descriptor).

The Collector may perform a write to the User Control Point to request a desired procedure. A procedure
begins when the Collector writes a particular Op Code to the User Control Point to perform some desired
action, and it ends when the Collector sends a confirmation to acknowledge the User Control Point
indication sent by the Fitness Machine at the end of the procedure. This indication includes: the
Response Code, the Requested Op Code, and the Response Value and may also include a Response
Parameter as defined in [8].

Refer to Section 4.8 for more information on the User Data access methods.

4.5.2.1 User Control Point Procedure Requirements

Table 4. 6 shows the requirements for the User Control Point procedures (Op Codes) in the context of this
profile.

```
Procedure (Op Code) Requirement
```
```
Register New User M
```
```
Consent M
```
```
Delete User Data M
```
Table 4. 6 : User Control Point Procedure Requirements

4.5.2.2 User Control Point Behavioral Description

The Collector shall write to the User Control Point characteristic using one of the supported Op Codes in
Table 4. 6 to request a Fitness Machine to perform a procedure. This may include a parameter that is valid
within the context of that Op Code as defined in [8].


4.5.2.2.1 Register New User Procedure

To register a new user in the Fitness Machine, the Collector shall use the Register New User Op Code
followed by a parameter value that represents the Consent Code defined by the user (or automatically
generated by the Collector) as defined in [8].

Collectors should not cache the Consent Code nor the User ID for later use, since the user data will be
deleted by the Fitness Machine when the connection is terminated.

The Collector shall wait for the Response Code User Control Point indication with the Response Value
set to Success, indicating successful operation, with a Response Parameter value that represents the
User Index assigned by the Fitness Machine for the new user, or for the procedure to time out according
to the procedure time-out operation described in Section 4.5.2.3. When the procedure is successful, the
Fitness Machine will return a Response Code containing the User Index.

See Section 4.7 for general error handling procedures.

4.5.2.2.2 Consent Procedure

To request the consent of a Fitness Machine user in order to access their UDS characteristics, the
Collector shall use the Consent Op Code followed by an array of 3 UINT8 parameter values that
represents the User Index (1 octet) followed by the Consent Code (2 octets) defined by the user as
defined in [8].

The Collector shall wait for the Response Code User Control Point indication with the Response Value
set to Success, indicating a successful operation, with a Response Parameter value that represents the
User Index assigned by the Fitness Machine for the new user, or the procedure to time out according to
the procedure time out operation described in Section 4.5.2.3. When the procedure is successful, the
Fitness Machine will return a Response Code containing the User Index.

See Section 4.7 for general error handling procedures.

4.5.2.2.3 Delete User Data Procedure

To request the deletion of the UDS characteristics of the Fitness Machine, the Collector shall use the
Delete User Data procedure.

The Collector shall wait for the Response Code User Control Point indication with the Response Value
set to Success, indicating successful operation, or for the procedure to time out according to the
procedure time-out operation described in Section 4.5.2.3.

See Section 4.7 for general error handling procedures.

4.5.2.3 Procedure Timeout

In the context of the User Control Point characteristic, a procedure is started when the Collector writes a
particular Op Code to the User Control Point to perform some desired action, and it ends when the
Collector sends a confirmation to acknowledge the User Control Point indication sent by the Fitness
Machine at the end of the procedure with the Op Code set to Response Code.

In the context of the User Control Point characteristic, a procedure is not considered started and is not
queued in the Fitness Machine when a write to the User Control Point results in an ATT Error Response.


A procedure is considered to have timed out if a User Control Point indication is not received within the
ATT transaction timeout, defined as 30 seconds in [2] Volume 2, Part F, Section 3.3.3, from the start of
the procedure.

If the link is lost while a User Control Point procedure is in progress, then the procedure shall be
considered to have timed out.

Thus, a Collector shall start a timer with the value set to the ATT transaction timeout after the write
response is received from the Fitness Machine. The timer shall be stopped when a User Control Point
indication is received and the Op Code is set to Response Code. If the timer expires, then the procedure
shall be considered to have failed.

If a User Control Point procedure times out, then no new User Control Point procedure shall be started by
the Collector until a new link is established with the Fitness Machine. To help ensure a good user
experience, if a User Control Point procedure times out, the Collector should disconnect and then
reconnect.

### 4.5.3 Other User Data Service Characteristics

If the Collector supports remote updating of user data to the Fitness Machine (e.g., First Name, Height,
Gender, Age, or Date of Birth values), the Collector shall support reading and writing to the corresponding
User Data Service characteristics as defined in [8].

### 4.5.4 User Data Synchronization Procedure

The User Data Synchronization procedure is optional. If it is supported, the requirements in this section
apply.

When a connection is established to a Fitness Machine supporting the User Data Retention feature, with
a previously registered user, and the Consent procedure has succeeded, the Collector shall read the
Database Change Increment characteristic value and compare it to its local (cached) value. Based on the
comparison between these two values, the Collector shall perform the appropriate action defined in Table
4. 7. After the synchronization procedure is completed, the Collector and the Fitness Machine will have the
same UDS characteristic and Database Change Increment values.

```
Condition Action Requirement
```
```
Database Change Increment values are equal in
both the Collector and the Fitness Machine.
```
```
The databases are synchronized and do not
require any action by the Collector.
The Database Change Increment value in the
Fitness Machine is greater than the value in the
Collector (i.e., the user data at the Fitness
Machine is more recent).
```
```
The Collector shall read and cache all the UDS
characteristics supported by the Collector. The
Collector shall also cache the Database Change
Increment value for future use.
The Database Change Increment value in the
Fitness Machine is less than the value in the
Collector (i.e., the user data at the Collector is
more recent).
```
```
The Collector shall write updated UDS
characteristics to the Fitness Machine. After the
user data is updated, the Collector shall also write
its local Database Change Increment value to the
Fitness Machine in order to complete the
synchronization procedure.
```
Table 4. 7 : User Data Synchronization Procedure Action Requirements

If notifications of the Database Change Increment characteristic are supported by the Fitness Machine,
the Collector shall configure it for notifications.


When the Collector updates the cached UDS characteristics while not in a connection (e.g., through its
UI), it shall increment by 1 the value of the cached Database Change Increment characteristic. This is to
synchronize the UDS characteristics values with the Fitness Machine at the next connection.

When a Collector that supports the update of UDS characteristics (e.g., through its UI) is connected to a
Fitness Machine, and when the Collector updates one or more UDS Characteristics values exposed by
the Fitness Machine, the Collector shall increment its local Database Change Increment value by 1 and
write the incremented value of the Database Change Increment characteristic to the Fitness Machine.

### 4.6 Device Information Service Characteristics

The Collector may read the value of Device Information Service characteristics.

### 4.7 General Error Handling

The Collector shall be tolerant and behave appropriately (i.e., the Collector shall be able to continue to
process commands and/or receive data normally) when receiving the following Control Point error codes
defined in [8]:

- Op Code Not Supported
- Invalid Parameter
- Operation Failed
- Control Not Permitted
- User Not Authorized

The Collector shall also be tolerant and behave appropriately (i.e., the Collector shall be able to continue
to process commands and/or receive data normally) when receiving the following Application ATT error
code defined [8]:

- User Data Access Not Permitted

The Collector shall also be tolerant and behave appropriately (i.e., the Collector shall be able to continue
to process commands and/or receive data normally) when receiving the following ATT error codes:

- Procedure Already In Progress
- Client Characteristic Configuration Descriptor Improperly Configured

If a Service Changed indication is received from the Fitness Machine, this indicates not only that the
Collector shall perform Service and Characteristic discovery (as defined in GATT) again within the handle
range specified, but also that the cached values for characteristics and descriptors may no longer be valid
and the Collector is required to refresh these cached values.

### 4.8 User Data Access Methods

If the Collector supports the User Data Service, depending on the capabilities of the Fitness Machine, the
Collector may use one of the procedures defined in Table 4. 8 to access user data of the Fitness Machine.


```
Condition Action Requirement
```
```
The Fitness Machine does not support the User
Data Retention feature.
```
```
The Collector shall use the Register New User
procedure defined in Section 4.5.2.2.1 each time
a new connection is established, followed by the
Consent procedure defined in Section 4.5.2.2.2,
in order to access the user data of the Fitness
Machine.
```
```
The Fitness Machine supports the User Data
Retention feature, and the user has not been
registered.
```
```
The Collector shall use the Register New User
procedure defined in Section 4.5.2.2.1, followed
by the Consent procedure defined in
Section 4.5.2.2.2, in order to access the user data
of the Fitness Machine.
```
```
The Fitness Machine supports the User Data
Retention feature, and the user is registered
```
```
The Collector shall use the Consent procedure
defined in Section 4.5.2.2.2 in order to access the
user data of the Fitness Machine.
If the Consent procedure succeeds, the Collector
should initiate the User Data Synchronization
procedure defined in Section 4.5.4.
If the Consent procedure fails, the Collector shall
assume that the user data no longer exists on the
Fitness Machine (for example, the data has been
deleted via the UI of the Fitness Machine) and
should reinitiate the Register procedure defined in
in Section 4.5.2.2.1.
```
Table 4. 8 : User Data Synchronization Procedure Action Requirements

After the Consent procedure has succeeded, the Collector should write the user data to the Fitness
Machine.

For privacy reasons, the Collector should use the Delete User procedure defined in Section 4.5.2.2.3
before terminating the connection with a Fitness Machine that does not support the User Data Retention
feature (e.g., a Fitness Machine designed for use in a public environment).

If the connection is terminated because of a link loss, the Collector should attempt to reinitiate the
connection. If the connection is reestablished within a short period of time (typically five seconds), the
Collector should use the Consent procedure defined in Section 4.5.2.2.2 to access the user data.


## 5 Connection Establishment Procedures

This section describes the procedures for establishing and terminating connections that are used by a
Fitness Machine and Collector in typical scenarios.

### 5.1 Fitness Machine Connection Establishment for Low Energy Transport

This section describes connection procedures that a Fitness Machine should follow to initiate a
connection with a Collector using a low energy transport.

- Section 5.1.1 describes the connection procedure that is used when the Fitness Machine does not
    support bonding, or if the Fitness Machine supports bonding but is not bonded with any Collectors.
- Section 5.1.2 describes the connection procedure that is used when the Fitness Machine is bonded
    with one or more Collectors.
- Section 5.1.3 describes the connection procedure that is used when the established connection is
    broken after a link loss and a reconnection is required.
- Section 5.1.4 describes the connection procedure that is used when the advertisement packet
    includes the Service Data AD Type.

### 5.1.1 Connection Procedure for Unbonded Devices

This procedure is used for connection establishment when the Fitness Machine is not bonded with any
Collectors and ready for connection (for example, when the Fitness Machine is initially powered on).

If a connection is not established within a certain period of time, which is defined by the manufacturer, the
Fitness Machine either may continue sending background advertising, to reduce power consumption, for
as long as it chooses, or it may stop advertising. The advertising interval and the time to perform
advertising are implementation specific and should be configured with consideration for user expectations
of connection establishment time using the GAP timers defined in [2] Volume 3, Part C, Section 9.3.11.

If a connection is not established within a time limit defined by the Fitness Machine, the Fitness Machine
may exit the GAP Connectable Mode.

Table 5. 1 summarizes the recommended connection procedure if the Fitness Machine is not bonded to
any Collectors.

```
Recommended GAP Modes Recommended Filter Policy Remarks
```
```
General Discoverable Mode
Undirected Connectable Mode
Bondable Mode
```
```
Attempt to connect to any
Collectors
```
Table 5. 1 : Recommended Connection Procedure for Unbonded Devices

A Fitness Machine that is designed for use in a public environment should not request the bonding
procedure with the Collector.

A Fitness Machine that is designed for use in a private environment may request the bonding procedure
with the Collector.

When a bond is created, refer to recommendations in Section 5.1.2.

When the Fitness Machine no longer requires a connection, it should perform the GAP Terminate
Connection procedure.


If the Fitness Machine has no data to transfer or a training session is terminated, and the connection is
idle, the Fitness Machine should wait at least longer than the maximum connection interval (e.g., 5
seconds) before performing the GAP Terminate Connection procedure. This allows the Collector to
perform any additional required actions (e.g., set new targeted value, read and write to UDS
characteristics, or delete the user data). For devices that support man-in-the-middle (MITM) protection, a
longer duration may be needed to allow the pairing sequence to complete.

### 5.1.2 Connection Procedure for Bonded Devices

Table 5. 2 summarizes the recommended procedure if the Fitness Machine is bonded with one or more
Collectors.

```
Recommended Time Recommended GAP Modes RecommePolicy nded Filter Remarks
```
```
First 10 seconds Non-Discoverable
Mode
Undirected
Connectable Mode
```
```
Attempt to connect to
only bonded Collectors
in the White List.
```
```
The White List should
be used in order to
accept connection
requests only from the
relevant bonded
Collector.
```
```
After 10 seconds General Discoverable
Mode
Undirected
Connectable Mode
Bondable Mode
```
```
Attempt to connect to
any Collectors.
```
```
This allows bonding
with a new Collector.
The connection
procedure for
unbonded devices is
described in
Section 5.1.1.
```
Table 5. 2 : Recommended Connection Procedure for Bonded Devices

If a Fitness Machine requires a connection to a Collector that did not use a resolvable private address
during bonding, the Fitness Machine may use Low Duty Cycle Directed Advertisements in order to
advertise to only the Collector for which it has data. When a Collector used a resolvable private address
during bonding, and the Fitness Machine requires a connection to that Collector, the Fitness Machine
should use the Undirected Connectable Mode along with the Service Data AD Type described in
Section 3.1.1.5 to reduce unwanted connection requests.

If a connection is not established within TGAP(adv_fast_period), the Fitness Machine may either continue
sending background advertising to reduce power consumption for as long as it chooses, or stop
advertising.

The advertising interval and the time to perform advertising are implementation specific and should be
configured with consideration for user expectations of connection establishment time using the GAP
timers defined in [2] Volume 3, Part C, Section 9.3.11.

If a connection is not established within a time limit defined by the Fitness Machine, the Fitness Machine
may exit the GAP Connectable Mode.

When the Fitness Machine is disconnected and the Fitness Machine is ready for reconnection (e.g., when
commanded by the user), the Fitness Machine should reinitiate the connection procedure (e.g., start
advertising).

If the Fitness Machine has no data to transfer or a training session is terminated, and the connection is
idle, the Fitness Machine should wait 5 seconds (the idle connection timeout interval) before performing
the GAP Terminate Connection procedure. This allows the Collector to perform any additional required


actions (e.g., read and write to UDS characteristics). For devices that support man-in-the-middle (MITM)
protection, a longer duration may be needed to allow completion of the pairing sequence.

### 5.1.3 Link Loss Reconnection Procedure

When a connection is terminated due to link loss, the Fitness Machine should attempt to reconnect to the
Collector by entering the GAP Connectable Mode.

### 5.1.4 Use of Service Data AD Type

This section outlines an optional procedure that is applicable when a Fitness Machine uses the
Undirected Connectable Mode and the Service Data AD Type.

The Service Data AD Type, described in Section 3.1.1.5, provides a mechanism to reduce unwanted
connection requests by unintended Collectors when Undirected Connectable Mode is used and when a
Fitness Machine is available for new connection. Refer also to Section 5.2.2 for the procedure from the
Collector perspective.

When a Fitness Machine uses undirected connectable advertisements, it should include the Service Data
AD Type in its Advertising Data as defined in [1]. This is to provide a mechanism to differentiate the
Fitness Machines that may be present in the same area based on their type (such as a treadmill or cross
trainer) and to avoid Collectors that do not support a particular type of Fitness Machine to initiate an
unwanted connection. This also allows Collectors to sort the Fitness Machines that are advertising based
on their type.

If the Fitness Machine needs to send advertisements but is not available for a new training session, the
Fitness Machine should set the Fitness Machine Available bit to 0 (Fitness Machine not available) so
Collectors should not initiate a connection to this particular Fitness Machine.

### 5.2 Collector Connection Establishment for Low Energy Transport

This section describes connection procedures a Collector should follow to initiate a connection with a
Fitness Machine using a low energy transport.

The Collector should use the GAP General Discovery procedure to discover a Fitness Machine.

A Collector may use one of the GAP connection procedures based on its connectivity requirements as
described in Table 5. 3.

```
Recommended Time Recommended GAP Modes Recommended Filter Policy
```
```
General Connection
Establishment
```
```
Allowed Allowed
```
```
Direct Connection
Establishment
```
```
Allowed Allowed
```
```
Auto Connection Establishment Not Allowed Allowed
```
```
Selective Connection
Establishment
```
```
Not Allowed Allowed
```
Table 5. 3 : Allowed GAP Connection Procedure

If a connection is not established within TGAP(scan_fast_period), the Collector may either continue
background scanning to reduce power consumption or stop scanning.


The connection interval, scan interval, scan window, and time to perform scanning are implementation
specific and should be configured with consideration for user expectations of connection establishment
time using the GAP timers defined in [2] Volume 3, Part C, Section 9.3.11.

If a connection is not established within a time limit defined by the Collector, the Collector may exit the
connection establishment procedure.

When the connection is established, the Collector may bond with the Fitness Machine, if requested by the
Fitness Machine.

Upon initial connection, the Collector may initiate the Register New User procedure defined in
Section 4.5.2.2.1 and may configure the new user data by writing to UDS characteristics.

The Collector should terminate the connection when the measurement session is terminated at the
Collector by the user.

When the Collector is disconnected, the Collector may continue scanning for advertisements from the
Fitness Machine and may initiate a new connection.

### 5.2.1 Link Loss Reconnection Procedure

When a connection is terminated because of link loss, the Collector should attempt to reconnect to the
Fitness Machine using any of the GAP connection procedures that use the connection establishment
timing parameters defined in [2] Volume 3, Part C (GAP), Section 9.3.11 and the connection interval
timing parameters defined in [2] Volume 3, Part C (GAP), Section 9.3.12.

### 5.2.2 Use of Service Data AD Type

This section outlines an optional procedure that is applicable when a Collector supports the use of the
Service Data AD Type for the Fitness Machine Service.

The Service Data AD Type described in Section 3.1.1.5 provides a mechanism to reduce unwanted
connection requests by unintended Collectors when the Undirected Connectable Mode is used and when
a Fitness Machine is available for new connection. Refer to Section 5.1.4 for the procedure from the
Fitness Machine perspective.

When a Collector receives an undirected connectable advertisement from a Fitness Machine that
includes the Service Data AD Type in its advertising data, the Collector shall read the Fitness Machine
Type field of the Service Data AD Type to determine the type of Fitness Machine that is advertising. If the
value of Fitness Machine Type field matches the Fitness Machine type supported by the Collector, the
Collector may initiate a connection to that particular Fitness Machine (e.g., typically directed by the user
via its UI). This mechanism may also be used to sort the different types of Fitness Machines that may be
present in the same area.

### 5.3 Connection Establishment for BR/EDR

This section describes the procedures for establishing and terminating connections used by a Fitness
Machine and Collector using a BR/EDR transport. Unlike the low energy connection procedures, which
describe specific connection parameters, BR/EDR connection establishment does not state requirements
beyond those described in GAP based on potential interactions with other BR/EDR profiles operating
concurrently on the Fitness Machine and/or Collector.

When using BR/EDR, devices can utilize sniff mode and sniff subrating to reduce power consumption;
however, no particular parameters are recommended, and the requirements of other profiles may need to
be considered.


### 5.3.1 Connection Procedure

The procedures for establishing a connection between a Fitness Machine and a Collector that do not
have an existing bond and for re-establishing a connection between bonded devices use the inquiry,
discovery, paging, pairing and security procedures described in Generic Access Profile of the Core
Specification [2] and any additional GAP requirements enumerated in Sections 6 and 7.

5.3.1.1 Connection Procedure for Unbonded Devices
The Fitness Machine shall use the GAP General or Limited Discoverable Mode when it is not bonded with
any Collectors and is ready for a connection (e.g., when commanded by the user).

The Collector should use the GAP General Discovery procedure to discover a Fitness Machine and
establish a connection to a Fitness Machine to which it is not bonded.

Either the Fitness Machine or the Collector can establish a BR/EDR link to a remote peer device.

After a link is established, the Collector shall discover the Fitness Machine Service using SDP procedures
before it establishes a GATT connection.

After the Fitness Machine Service is discovered and a GATT connection is established, the Collector shall
discover the Fitness Machine Service characteristics exposed by this service using GATT Discovery
procedures.

Once connected, the Collector shall configure any Fitness Machine Service characteristics that require
indications or notifications.

The Collector should terminate the connection when the measurement session is terminated at the
Collector by the user.

When the Fitness Machine no longer has data to send, it may disconnect the link, depending on the use
cases of the devices and other profiles connected on either device.

5.3.1.2 Connection Procedure for Bonded Devices
The Fitness Machine shall use the GAP Link Establishment Procedure to connect to any bonded
Collectors when it is ready for a connection (e.g., when commanded by the user).

The Collector shall be Connectable to accept a connection from a Fitness Machine to which it is bonded.

Either the Fitness Machine or the Collector can establish a BR/EDR link to a remote peer device.

Upon initial connection, the Collector may initiate the Register New User procedure defined in
Section 4.5.2.2.1 and may configure the new user data by writing to UDS characteristics.

If a higher layer determines the bond no longer exists on the remote device, the local device must
reconfigure the remote device after the following conditions are met:

- User interaction confirms that the user wants to pair with the remote device again,
- Re-bonding has been performed, and
- Service discovery has been performed. (If the local device had previously determined that the remote
    device did not have the «Service Changed» characteristic, then service discovery may be skipped
    because the service is not allowed to change per the Core Specification.)

When the Fitness Machine no longer has data to send, it may disconnect the link, depending on the use
cases of the devices and other profiles connected on either device.

The Collector should terminate the connection when the measurement session is terminated at the
Collector by the user.


When the Fitness Machine is disconnected and it is ready for reconnection (e.g., when commanded by
the user), the Fitness Machine should initiate a connection with the Collector.

If the Fitness Machine has no data to transfer (or no further data to transfer) and the connection is idle,
the Fitness Machine should wait 5 seconds (the idle connection timeout interval) before performing the
GAP Terminate Connection procedure. This allows the Collector to perform any additional required
actions (e.g., read and write to UDS characteristics). For devices that support man-in-the-middle (MITM)
protection, a longer duration may be needed to allow completion of the pairing sequence.

### 5.3.2 Link Loss Reconnection Procedure

When a connection is terminated due to link loss, a Fitness Machine should reconnect to the Collector by
attempting, for an implementation-specific time, to reestablish an ACL link between the two devices. The
Collector should remain Connectable for an implementation-specific time so that a Fitness Machine can
reestablish an ACL link.


## 6 Security Considerations

This section describes the security considerations for a Fitness Machine and Collector.

### 6.1 Fitness Machine Security Considerations for Low Energy

This section describes the security requirements for the Fitness Machine for a low energy transport.

- All supported characteristics specified by the Fitness Machine Service except the Fitness Machine
    Control Point shall be set to LE Security Mode 1 and Security Level 1 or higher.
- The Fitness Machine Control Point shall be set to LE Security Mode 1 and Security Level 2 or higher.
- If used, all characteristics exposed by the User Data Service for use by this profile should be set to
    the same security mode and level as the Fitness Machine Control Point characteristic.
- If present and writable, the Device Name descriptor should support authentication.
- A Fitness Machine that is designed for use in a public environment should not request bonding.
- A Fitness Machine that is designed for use in a private environment may request bonding.
- If the Fitness Machine has a UI or any other mechanisms enabling a higher security level (e.g., Out of
    Band using NFC), the Fitness Machine may request MITM protection (Security Mode 1, Level 3).

### 6.2 Collector Security Considerations for Low Energy

This section describes the security requirements for the Collector for a low energy transport.

- The Collector shall support bonding in case it is requested by the Fitness Machine.
- The Collector shall accept any request by the Fitness Machine for LE Security Mode 1 and Security
    Level 2 or higher.

### 6.3 Security Considerations for BR/EDR

As required by GAP, Security Mode 4 (service-level enforced security) shall be used for connections by
the Fitness Machine and the Collector.

- The Fitness Machine may initiate Dedicated Bonding with the Collector. However, if the Fitness
    Machine supports multiple users, then it shall initiate Dedicated Bonding and shall support as many
    bonds as the number of supported users.
- The Collector shall support bonding in case it is requested by the Fitness Machine.
- If the Fitness Machine has a UI or any other mechanisms enabling a higher security level, the Fitness
    Machine may request MITM protection.


## 7 Generic Access Profile for BR/EDR

This section defines the support requirements for the capabilities as defined in the Generic Access Profile
of the Core Specification [2] when BR/EDR is used.

### 7.1 Modes

The Mode procedures as defined in GAP describe requirements for both Fitness Machines and
Collectors. This profile further refines the requirements.

- Discoverable Mode shall be supported by Fitness Machines supporting BR/EDR.
- Bondable Mode should be supported by Fitness Machines and Collectors.

Table 7. 1 shows the support status for GAP Modes in this profile.

```
Procedure Support in Fitness Machine Support in Collector
```
```
Discoverable Mode M N/A
```
```
Bondable Mode O O
```
Table 7. 1 : Modes

### 7.2 Idle Mode Procedures

The Idle Mode procedures as defined in GAP describe requirements for both Fitness Machines and
Collectors involved. This profile further refines the requirements.

- General Inquiry shall be supported by all Collectors.
- General Bonding should be supported by all Fitness Machines and Collectors.

Table 7. 2 shows the support status for Idle Mode procedures within this profile.

```
Procedure Support in Fitness Machine Support in Collector
```
```
General Inquiry N/A M
```
```
General Bonding O O
```
Table 7. 2 : Idle Mode Procedures


## 8 Acronyms and Abbreviations

```
Abbreviation Meaning
```
```
BR/EDR Basic Rate/Enhanced Data Rate
GAP Generic Access Profile
GATT Generic Attribute Profile
LE Low Energy; the low energy feature of Bluetooth
MITM protection Man-in-the-middle protection
NFC Near Field Communication
```
Table 8. 1 : Acronyms and Abbreviations


## 9 References

[1] Fitness Machine Service

[2] Bluetooth Core Specification, v4.0 or later

[3] Bluetooth Core Specification Supplement, v5 or later

[4] Service UUIDs, Characteristic and Descriptor descriptions accessible via the Bluetooth SIG
Assigned Numbers

[5] Document Naming Procedure, Bluetooth SIG (BARB Approved)

[6] Bluetooth Documentation Review Guidelines, V10r04, 20 January 2004

[7] ITU-T Recommendation Z.120, Message Sequence Chart (MSC)

[8] User Data Service

[9] Device Information Service


