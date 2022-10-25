import { useEffect, useState } from 'react';
import { useMutation } from '@apollo/client';
import { Button, Form, Input, InputNumber, Select, Typography } from 'antd';
import { v4 as uuidv4 } from 'uuid';

import { ADD_CAR, GET_PEOPLE_WITH_CARS } from '../../queries';

const { Title } = Typography;

const AddCar = ({ peopleWithCars }) => {
	const [id, setId] = useState(uuidv4());
	const [addCar] = useMutation(ADD_CAR);

	const [form] = Form.useForm();
	const [, forceUpdate] = useState();
	const { Option } = Select;

	useEffect(() => {
		forceUpdate({});
	}, []);

	const onFinish = values => {
		const { year, make, model, price, personId } = values;

		addCar({
			variables: {
				id,
				year,
				make,
				model,
				price,
				personId,
			},
			update: (cache, { data: { addCar } }) => {
				const data = cache.readQuery({ query: GET_PEOPLE_WITH_CARS });

				let updatedData = data.peopleWithCars.map(p => {
					if (p.id === addCar.personId) {
						return {
							...p,
							cars: [...p.cars, { ...addCar }],
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

		form.resetFields();
		setId(uuidv4());
	};

	return (
		<>
			<Title level={2}>Add Car</Title>
			<Form
				form={form}
				name='add-car-form'
				layout='inline'
				onFinish={onFinish}
				size='large'
				style={{ marginBottom: '40px' }}
			>
				<Form.Item name='year' rules={[{ required: true, message: 'Please input the year!' }]} label='Year'>
					<InputNumber placeholder='i.e. 1995' />
				</Form.Item>

				<Form.Item name='make' rules={[{ required: true, message: 'Please input the make!' }]} label='Make'>
					<Input placeholder='i.e. Volvo' />
				</Form.Item>

				<Form.Item name='model' rules={[{ required: true, message: 'Please input the model!' }]} label='Model'>
					<Input placeholder='i.e. XC40' />
				</Form.Item>

				<Form.Item name='price' rules={[{ required: true, message: 'Please input the price!' }]} label='Price'>
					<InputNumber style={{ width: 100 }} placeholder='i.e. 55000' />
				</Form.Item>

				<Form.Item
					name='personId'
					rules={[{ required: true, message: 'Please select the owner!' }]}
					label='Person'
				>
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
							disabled={
								!form.isFieldsTouched(true) ||
								form.getFieldsError().filter(({ errors }) => errors.length).length
							}
						>
							Add car
						</Button>
					)}
				</Form.Item>
			</Form>
		</>
	);
};

export default AddCar;
