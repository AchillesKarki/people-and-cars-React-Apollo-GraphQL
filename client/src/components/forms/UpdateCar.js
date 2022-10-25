import { useEffect, useState } from 'react';
import { useMutation } from '@apollo/client';
import { Button, Form, Input, InputNumber, Select } from 'antd';

import { GET_PEOPLE_WITH_CARS, UPDATE_CAR } from '../../queries';

const UpdateCar = ({ id, year, make, model, price, personId: previousPersonId, peopleWithCars, onButtonClick }) => {
	const [updateCar] = useMutation(UPDATE_CAR);

	const [form] = Form.useForm();
	const [, forceUpdate] = useState();
	const { Option } = Select;

	useEffect(() => {
		forceUpdate({});
	}, []);

	const onFinish = values => {
		const { year, make, model, price, personId } = values;

		updateCar({
			variables: {
				id,
				year,
				make,
				model,
				price,
				personId,
			},
			update: (cache, { data: { updateCar } }) => {
				const data = cache.readQuery({ query: GET_PEOPLE_WITH_CARS });

				let updatedData = data.peopleWithCars.map(p => {
					if (p.id === updateCar.personId && previousPersonId === updateCar.personId) {
						return {
							...p,
							cars: p.cars.map(car => {
								if (car.id === updateCar.id) {
									return {
										...car,
										year,
										make,
										model,
										price,
										personId,
									};
								}

								return car;
							}),
						};
					} else if (p.id === updateCar.personId) {
						return {
							...p,
							cars: p.cars.concat({ id, year, make, model, price, personId }),
						};
					} else {
						return {
							...p,
							cars: p.cars.filter(car => car.id !== updateCar.id),
						};
					}
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

		onButtonClick();
	};

	return (
		<Form
			form={form}
			name='add-car-form'
			onFinish={onFinish}
			size='large'
			style={{ marginTop: '20px', marginBottom: '20px' }}
			initialValues={{
				id,
				year,
				make,
				model,
				price,
				personId: previousPersonId,
			}}
		>
			<Form.Item name='year' rules={[{ required: true, message: 'Please input the year!' }]}>
				<InputNumber placeholder='i.e. 1995' />
			</Form.Item>

			<Form.Item name='make' rules={[{ required: true, message: 'Please input the make!' }]}>
				<Input placeholder='i.e. Volvo' />
			</Form.Item>

			<Form.Item name='model' rules={[{ required: true, message: 'Please input the model!' }]}>
				<Input placeholder='i.e. XC40' />
			</Form.Item>

			<Form.Item name='price' rules={[{ required: true, message: 'Please input the price!' }]}>
				<InputNumber placeholder='i.e. 55000' />
			</Form.Item>

			<Form.Item name='personId' rules={[{ required: true, message: 'Please select the owner!' }]}>
				<Select style={{ width: 200 }} placeholder='i.e John Smith'>
					{peopleWithCars &&
						peopleWithCars.map(({ id, firstName, lastName }) => (
							<Option key={id} value={id}>
								{firstName} {lastName}
							</Option>
						))}
				</Select>
			</Form.Item>

			<Form.Item shouldUpdate={true}>
				{() => (
					<Button
						type='primary'
						htmlType='submit'
						disabled={form.getFieldsError().filter(({ errors }) => errors.length).length}
					>
						Update car
					</Button>
				)}
			</Form.Item>

			<Button type='danger' onClick={onButtonClick}>
				Cancel
			</Button>
		</Form>
	);
};

export default UpdateCar;
