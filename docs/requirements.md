# Requirements

Note: There is one physical shop in Graz in which the bikes can be rented and have to be returned. The payment 
happens in the shop. 

## GOAL
Development of a booking platform that makes possible for persons or groups to search for bikes 
and rent for a specific period of time. Moreover, it offers the possibility for bike-shop owner to 
manage the booking's process.

## ROLES:
Employee, Customer, Administrator

**Customer**
- Wants to rent bike (login)
- Check list of bikes available (no login)

**Employee**
- Confirm booking of the bike
- Create and add new bikes in the system

**Administrator**
- Manages Employee/ customer accounts
- Sets prices and manages bikes

## FUNCTIONS

### **Customer** 

**Registration**
  - must insert a valid e-mail address and password
  - insert of firstname, surname, birthdate, address
  
**Login**
  - login with e-mail and password

**Search function**
  - Search by date, time and group size to see which bike is available
  - Feedback if not available/ different suggestion

**Booking**
  - Can access the bike catalog
  - Possibility to define the group size
  - Confirm the booking process
  - Cancel the booking process
  - infos about rental conditions (no-show, delayed)
  - total sum of rental cost
  - if no-show, bike is again available 

**User profile**
  - user info from registration
  - change user info
  - cancel/ change/ status current booking

### **Employee**
  - Follows up on the status of the booking 
  - Confirm of the pick-up
  - Confirm of the retour 
  - Confirm of the payment


### **Administrator:**
  - 

### **Bike Catalog:** 
- List of bikes with description, picture, price, number of bikes available
- Filter function:
  - brand
  - category
  - price
  - height
  - tire
  - size
