import { useMutation } from '@apollo/client';
import { Button, Form, Input } from 'antd';
import { useEffect, useState } from 'react';

import { GET_PEOPLE_WITH_CARS, UPDATE_PERSON } from '../../queries';

const UpdatePerson = props => {
	const { id, firstName, lastName } = props;
	const [updatePerson] = useMutation(UPDATE_PERSON);

	const [form] = Form.useForm();
	const [, forceUpdate] = useState();

	useEffect(() => {
		forceUpdate({});
	}, []);

	const onFinish = values => {
		const { firstName, lastName } = values;

		updatePerson({
			variables: {
				id,
				firstName,
				lastName,
			},
			update: cache => {
				const data = cache.readQuery({ query: GET_PEOPLE_WITH_CARS });

				let updatedData = data.peopleWithCars.map(p => {
					if (p.id === id) {
						return {
							...p,
							firstName,
							lastName,
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

		props.onButtonClick();
	};

	return (
		<Form
			form={form}
			name='update-person-form'
			layout='inline'
			onFinish={onFinish}
			initialValues={{
				firstName: firstName,
				lastName: lastName,
			}}
		>
			<Form.Item name='firstName' rules={[{ required: true, message: 'Please input your first name!' }]}>
				<Input placeholder='i.e. John' />
			</Form.Item>

			<Form.Item name='lastName' rules={[{ required: true, message: 'Please input your last name!' }]}>
				<Input placeholder='i.e. Smith' />
			</Form.Item>

			<Form.Item shouldUpdate={true}>
				{() => (
					<Button
						type='primary'
						htmlType='submit'
						disabled={
							(!form.isFieldTouched('firstName') && !form.isFieldTouched('lastName')) ||
							form.getFieldsError().filter(({ errors }) => errors.length).length
						}
					>
						Update Person
					</Button>
				)}
			</Form.Item>

			<Button type='danger' onClick={props.onButtonClick}>
				Cancel
			</Button>
		</Form>
	);
};

export default UpdatePerson;
