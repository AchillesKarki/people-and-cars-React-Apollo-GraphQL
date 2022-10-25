import { useEffect, useState } from 'react';
import { useMutation } from '@apollo/client';
import { Button, Form, Input, Typography } from 'antd';
import { v4 as uuidv4 } from 'uuid';

import { ADD_PERSON, GET_PEOPLE_WITH_CARS } from '../../queries';

const { Title } = Typography;

const AddPerson = () => {
	const [id, setId] = useState(uuidv4());
	const [addPerson] = useMutation(ADD_PERSON);

	const [form] = Form.useForm();
	const [, forceUpdate] = useState();

	useEffect(() => {
		forceUpdate({});
	}, []);

	const onFinish = values => {
		const { firstName, lastName } = values;

		addPerson({
			variables: {
				id,
				firstName,
				lastName,
			},
			update: (cache, { data: { addPerson } }) => {
				const data = cache.readQuery({ query: GET_PEOPLE_WITH_CARS });
				cache.writeQuery({
					query: GET_PEOPLE_WITH_CARS,
					data: {
						...data,
						peopleWithCars: [
							...data.peopleWithCars,
							{ ...addPerson, __typename: 'PersonWithCars', cars: [] },
						],
					},
				});
			},
		});

		form.resetFields();
		setId(uuidv4());
	};

	return (
		<>
			<Title level={2}>Add Person</Title>
			<Form
				form={form}
				name='add-person-form'
				layout='inline'
				onFinish={onFinish}
				size='large'
				style={{ marginBottom: '40px' }}
			>
				<Form.Item
					name='firstName'
					rules={[{ required: true, message: 'Please input your first name!' }]}
					label='First Name'
				>
					<Input placeholder='i.e. John' />
				</Form.Item>

				<Form.Item
					name='lastName'
					rules={[{ required: true, message: 'Please input your last name!' }]}
					label='Last Name'
				>
					<Input placeholder='i.e. Smith' />
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
							Add Person
						</Button>
					)}
				</Form.Item>
			</Form>
		</>
	);
};

export default AddPerson;
