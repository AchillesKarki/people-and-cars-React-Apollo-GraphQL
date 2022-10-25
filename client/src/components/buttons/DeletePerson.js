import { DeleteOutlined } from '@ant-design/icons';
import { useMutation } from '@apollo/client';

import { GET_PEOPLE_WITH_CARS, DELETE_PERSON } from '../../queries';

const DeletePerson = ({ id }) => {
	const [deletePerson] = useMutation(DELETE_PERSON);

	const handleButtonClick = () => {
		let result = window.confirm('Are you sure you want to delete this person?');

		if (result) {
			deletePerson({
				variables: {
					id,
				},
				update(cache, { data: { deletePerson } }) {
					const data = cache.readQuery({ query: GET_PEOPLE_WITH_CARS });
					cache.writeQuery({
						query: GET_PEOPLE_WITH_CARS,
						data: {
							...data,
							peopleWithCars: [
								...data.peopleWithCars.filter(o => {
									return o.id !== deletePerson.id;
								}),
							],
						},
					});
				},
			});
		}
	};

	return <DeleteOutlined key='delete' onClick={handleButtonClick} style={{ color: 'red' }} />;
};

export default DeletePerson;
