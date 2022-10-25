import { gql } from 'apollo-server-express';
import { remove } from 'lodash';

let people = [
	{
		id: '1',
		firstName: 'Bill',
		lastName: 'Gates',
	},
	{
		id: '2',
		firstName: 'Steve',
		lastName: 'Jobs',
	},
	{
		id: '3',
		firstName: 'Linux',
		lastName: 'Torvalds',
	},
];

let cars = [
	{
		id: '1',
		year: '2019',
		make: 'Toyota',
		model: 'Corolla',
		price: '40000',
		personId: '1',
	},
	{
		id: '2',
		year: '2018',
		make: 'Lexus',
		model: 'LX 600',
		price: '13000',
		personId: '1',
	},
	{
		id: '3',
		year: '2017',
		make: 'Honda',
		model: 'Civic',
		price: '20000',
		personId: '1',
	},
	{
		id: '4',
		year: '2019',
		make: 'Acura',
		model: 'MDX',
		price: '60000',
		personId: '2',
	},
	{
		id: '5',
		year: '2018',
		make: 'Ford',
		model: 'Focus',
		price: '35000',
		personId: '2',
	},
	{
		id: '6',
		year: '2017',
		make: 'Honda',
		model: 'Pilot',
		price: '45000',
		personId: '2',
	},
	{
		id: '7',
		year: '2019',
		make: 'Volkswagen',
		model: 'Golf',
		price: '40000',
		personId: '3',
	},
	{
		id: '8',
		year: '2018',
		make: 'Kia',
		model: 'Sorento',
		price: '45000',
		personId: '3',
	},
	{
		id: '9',
		year: '2017',
		make: 'Volvo',
		model: 'XC40',
		price: '55000',
		personId: '3',
	},
];

export const typeDefs = gql`
	type Person {
		id: String!
		firstName: String!
		lastName: String!
	}

	type Car {
		id: String!
		year: Int!
		make: String!
		model: String!
		price: Float!
		personId: String!
	}

	type PersonWithCars {
		id: String!
		firstName: String!
		lastName: String!
		cars: [Car]
	}

	type Query {
		people: [Person]
		person(id: String): Person
		cars: [Car]
		peopleWithCars: [PersonWithCars]
		personWithCars(id: String!): PersonWithCars
	}

	type Mutation {
		addPerson(id: String!, firstName: String!, lastName: String!): Person
		updatePerson(id: String!, firstName: String, lastName: String): Person
		deletePerson(id: String!): Person
		addCar(id: String!, year: Int!, make: String!, model: String!, price: Float!, personId: String!): Car
		updateCar(id: String!, year: Int, make: String, model: String, price: Float, personId: String): Car
		deleteCar(id: String!): Car
	}
`;

export const resolvers = {
	Query: {
		people: () => people,
		person: (_, args) => people.find(p => p.id === args.id),
		cars: () => cars,
		peopleWithCars: () => {
			return people.map(person => {
				const personCars = cars.filter(car => car.personId === person.id);

				return {
					...person,
					cars: personCars,
				};
			});
		},
		personWithCars: (_, args) => {
			const person = people.find(p => p.id === args.id);

			const personCars = cars.filter(car => car.personId === args.id);

			return {
				...person,
				cars: personCars,
			};
		},
	},

	Mutation: {
		addPerson: (_, args) => {
			const newPerson = {
				id: args.id,
				firstName: args.firstName,
				lastName: args.lastName,
			};

			people.push(newPerson);
			return newPerson;
		},

		updatePerson: (_, args) => {
			const person = people.find(p => p.id === args.id);

			if (!person) throw new Error(`Person with id ${args.id} doesn't exist!`);

			person.firstName = args.firstName;
			person.lastName = args.lastName;

			return person;
		},

		deletePerson: (_, args) => {
			const person = people.find(p => p.id === args.id);

			if (!person) throw new Error(`Person with id ${args.id} doesn't exist!`);

			remove(people, p => p.id === person.id);

			cars = cars.filter(car => car.personId !== args.id);

			return person;
		},

		addCar: (_, args) => {
			const newCar = {
				id: args.id,
				year: args.year,
				make: args.make,
				model: args.model,
				price: args.price,
				personId: args.personId,
			};

			cars.push(newCar);
			return newCar;
		},

		updateCar: (_, args) => {
			const car = cars.find(p => p.id === args.id);

			if (!car) throw new Error(`Car with id ${args.id} doesn't exist!`);

			car.year = args.year;
			car.make = args.make;
			car.model = args.model;
			car.price = args.price;
			car.personId = args.personId;

			return car;
		},

		deleteCar: (_, args) => {
			const car = cars.find(p => p.id === args.id);

			if (!car) throw new Error(`Car with id ${args.id} doesn't exist!`);

			remove(cars, p => p.id === car.id);

			return car;
		},
	},
};
