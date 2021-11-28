const fs = require('fs');
const { v4: uuidv4, validate } = require('uuid');

class Persons {
  constructor(dataBase) {
    this.dataBase = dataBase ?? './dataBase.json';
    if (!fs.existsSync(this.dataBase)) {
      fs.writeFileSync(this.dataBase, '[]');
    }
    this.data = JSON.parse(fs.readFileSync(this.dataBase, 'utf8'));
  }

  updateDataBase = () => {
    fs.writeFileSync(this.dataBase, JSON.stringify(this.data));
  };

  notFound = (id) => ({ message: `not found person with id: ${id}`, status: 404 });
  invalidID = () => ({ status: 400, message: `invalid id` });

  get = (id = false) => {
    if (id) {
      if (validate(id)) {
        const person = this.data.find((person) => person.id === id);
        if (person) return { data: person, status: 200 };
        return this.notFound(id);
      }
      return this.invalidID();
    }
    return { data: this.data, status: 200 };
  };

  put = (id, name, age, hobbies) => {
    if (validate(id)) {
      const personIndex = this.data.findIndex((person) => person.id === id);
      if (personIndex >= 0) {
        this.data[personIndex].name = name;
        this.data[personIndex].age = age;
        this.data[personIndex].hobbies = hobbies;
        this.updateDataBase();
        return { status: 200, data: this.data[personIndex] };
      } 
      return this.notFound(id);
    }
    return this.invalidID();
  };

  post = (name, age, hobbies) => {
    const personID = uuidv4();
    this.data.push({
      id: personID,
      name: name,
      age: age,
      hobbies: hobbies,
    });
    this.updateDataBase();
    return { status: 201, data: this.data[this.data.length - 1] };
  };

  delete = (id) => {
    if (validate(id)) {
      const personIndex = this.data.findIndex((person) => person.id === id);
      if (personIndex >= 0) {
        this.data.splice(personIndex, 1);
        this.updateDataBase();
        return { message: `delete person with id: ${id}`, status: 204 };
      } else return this.notFound(id);
    }
    return this.invalidID();
  };
};

module.exports = Persons;