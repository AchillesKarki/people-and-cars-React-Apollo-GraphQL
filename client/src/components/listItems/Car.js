import { useState } from 'react';
import { Link } from 'react-router-dom';
import { EditOutlined } from '@ant-design/icons';
import { Card } from 'antd';

import DeletePerson from '../buttons/DeletePerson';
import UpdateCar from '../forms/UpdateCar';
import DeleteCar from '../buttons/DeleteCar';

const getStyles = () => ({
	card: {
		width: '500px',
		marginTop: 20,
	},
});

const Car = ({ id, year, make, model, price, personId, firstName, lastName, peopleWithCars, showPage }) => {
	const styles = getStyles();

	const [editMode, setEditMode] = useState(false);

	const handleButtonClick = () => setEditMode(!editMode);

	return (
		<>
			{editMode ? (
				<UpdateCar
					id={id}
					year={year}
					make={make}
					model={model}
					price={price}
					personId={personId}
					peopleWithCars={peopleWithCars}
					onButtonClick={handleButtonClick}
				/>
			) : (
				<Card
					style={styles.card}
					actions={
						showPage ? [] : [<EditOutlined key='edit' onClick={handleButtonClick} />, <DeleteCar id={id} />]
					}
				>
					{year} {make} {model} - ${price} ({firstName} {lastName})
				</Card>
			)}
		</>
	);
};

export default Car;
