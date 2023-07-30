const fs = require("fs").promises; 
require("colors"); 
const path = require("path"); 

const contactsPath = path.join("./db", "contacts.json"); 
const contactsDataBase = require("./db/contacts.json"); 

function parseContacts(data) {
  return JSON.parse(data.toString()); 
}

async function listContacts() {
    try {
      const data = await fs.readFile(contactsPath);
      const list = parseContacts(data);
      const result = [...list].sort((a, b) => a.name.localeCompare(b.name));
      console.table(result);
    } catch (error) {
      console.log(error.message);
    }
  }

  async function getContactById(contactId) {
    try {
      const data = await fs.readFile(contactsPath);
      const contacts = parseContacts(data);
      const contactsFilter = contacts.filter((contact) => contact.id === contactId);
  
      if (contactsFilter.length > 0) {
        console.table(contactsFilter);
      } else {
        console.log(`There is no contact with the id: ${contactId}`.red);
      }
    } catch (error) {
      console.log(error.message);
    }
  }


async function removeContact(contactId) {
    try {
      const data = await fs.readFile(contactsPath);
      const contacts = parseContacts(data);
  
      const contactIndex = contacts.findIndex((contact) => contact.id === contactId);
  
      if (contactIndex !== -1) {
        contacts.splice(contactIndex, 1);
  
        await fs.writeFile(contactsPath, JSON.stringify(contacts));
        console.log(`Contact with the id ${contactId} has been removed.`.green);
      } else {
        console.log(`There is no contact with the id: ${contactId}.`.red);
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  async function addContact(name, email, phone) {
    if (!name || !email || !phone) {
      console.log("Please set all arguments (name, email, phone) to add contact".red);
      return;
    }
  
    const contact = {
      id: (Math.floor(Math.random() * 100000) + contactsDataBase.length).toString(),
      name,
      email,
      phone,
    };
  
    contactsDataBase.push(contact);
  
    try {
      const contactsUpdate = JSON.stringify(contactsDataBase);
      await fs.writeFile(contactsPath, contactsUpdate);
      console.log(`${name} has been added to your contacts`.green);
    } catch (error) {
      console.log("Oops, something went wrong:".red, error.message);
    }
  }

module.exports = {
    listContacts,
    getContactById,
    removeContact,
    addContact,
  };