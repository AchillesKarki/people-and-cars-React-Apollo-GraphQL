import { List, Typography } from 'antd';

import Person from '../listItems/Person';

const getStyles = () => ({
	list: {
		display: 'flex',
		justifyContent: 'center',
	},
});

const { Title } = Typography;

const People = ({ peopleWithCars, showPage = false }) => {
	const styles = getStyles();

	return (
		<>
			<Title level={2}>Records</Title>
			<List grid={{ gutter: 20, column: 1 }} style={styles.list}>
				{peopleWithCars.map(({ id, firstName, lastName, cars }) => (
					<List.Item key={id}>
						<Person
							id={id}
							firstName={firstName}
							lastName={lastName}
							cars={cars}
							peopleWithCars={peopleWithCars}
							showPage={showPage}
						/>
					</List.Item>
				))}
			</List>
		</>
	);
};

export default People;
