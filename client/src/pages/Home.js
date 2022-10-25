import { useQuery } from '@apollo/client';

import AddCar from '../components/forms/AddCar';
import AddPerson from '../components/forms/AddPerson';
import People from '../components/lists/People';
import { GET_PEOPLE_WITH_CARS } from '../queries';

const Home = () => {
	const { loading, error, data } = useQuery(GET_PEOPLE_WITH_CARS);
	if (loading) return 'Loading...';
	if (error) return `Error! ${error.message}`;

	return (
		<>
			<AddPerson />
			{data.peopleWithCars.length > 0 && <AddCar peopleWithCars={data.peopleWithCars} />}
			<People peopleWithCars={data.peopleWithCars} />
		</>
	);
};

export default Home;
