import { useState } from 'react';
import { Link } from 'react-router-dom';
import { EditOutlined } from '@ant-design/icons';
import { Card, Typography } from 'antd';

import UpdatePerson from '../forms/UpdatePerson';
import DeletePerson from '../buttons/DeletePerson';

import Car from './Car';

const getStyles = () => ({
	card: {
		width: '800px',
		backgroundColor: '#ececec',
		marginTop: "20px"
	},
});

const { Title } = Typography;

const Person = ({ id, firstName, lastName, cars, peopleWithCars, showPage }) => {
	const styles = getStyles();

	const [editMode, setEditMode] = useState(false);

	const handleButtonClick = () => setEditMode(!editMode);
	const actions = showPage
		? [<Link to={`/`}>GO BACK HOME</Link>]
		: [
				<Link to={`/people/${id}`}>LEARN MORE</Link>,
				<EditOutlined key='edit' onClick={handleButtonClick} />,
				<DeletePerson id={id} />,
		  ];

	return (
		<>
			{editMode ? (
				<UpdatePerson id={id} firstName={firstName} lastName={lastName} onButtonClick={handleButtonClick} />
			) : (
				<Card style={styles.card} actions={actions}>
					<Title level={3}>
						{' '}
						{firstName} {lastName}{' '}
					</Title>
					{cars.map(({ id, year, make, model, price, personId }) => (
						<Car
							key={id}
							type='inner'
							title='Inner Card title'
							id={id}
							year={year}
							make={make}
							model={model}
							price={price}
							personId={personId}
							firstName={firstName}
							lastName={lastName}
							peopleWithCars={peopleWithCars}
							showPage={showPage}
						>
							Inner Card content
						</Car>
					))}
				</Card>
			)}
		</>
	);
};

export default Person;
