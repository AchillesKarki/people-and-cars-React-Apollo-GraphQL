import { useQuery } from '@apollo/client';
import React from 'react';
import { useParams } from 'react-router-dom';
import People from '../components/lists/People';
import { GET_PERSON_WITH_CARS } from '../queries';

const ShowPage = () => {
	let { personId } = useParams();

	const { loading, error, data } = useQuery(GET_PERSON_WITH_CARS, {
		variables: { personWithCarsId: personId },
	});
	if (loading) return 'Loading...';
	if (error) return `Error! ${error.message}`;

	return <People peopleWithCars={[data.personWithCars]} showPage={true} />;
};

export default ShowPage;
