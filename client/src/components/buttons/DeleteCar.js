import { DeleteOutlined } from '@ant-design/icons';
import { useMutation } from '@apollo/client';

import { GET_PEOPLE_WITH_CARS, DELETE_CAR } from '../../queries';

const DeleteCar = ({ id }) => {
	const [deleteCar] = useMutation(DELETE_CAR);

	const handleButtonClick = () => {
		let result = window.confirm('Are you sure you want to delete this car?');

		if (result) {
			deleteCar({
				variables: {
					id,
				},
				update(cache, { data: { deleteCar } }) {
					const data = cache.readQuery({ query: GET_PEOPLE_WITH_CARS });

					let updatedData = data.peopleWithCars.map(p => {
						if (p.id === deleteCar.personId) {
							return {
								...p,
								cars: p.cars.filter(car => car.id !== deleteCar.id),
							};
						}

						return p;
					});

					cache.writeQuery({
						query: GET_PEOPLE_WITH_CARS,
						data: {
							...data,
							peopleWithCars: [...updatedData],
						},
					});
				},
			});
		}
	};

	return <DeleteOutlined key='delete' onClick={handleButtonClick} style={{ color: 'red' }} />;
};

export default DeleteCar;
