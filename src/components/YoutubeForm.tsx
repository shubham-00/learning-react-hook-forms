import { useForm, useFieldArray, FieldErrors } from 'react-hook-form';
import { DevTool } from '@hookform/devtools';

type FormValues = {
	username: string;
	email: string;
	channel: string;
	social: {
		twitter: string;
		facebook: string;
	};
	phoneNumbers: string[];
	phNumbers: {
		number: string;
	}[];
	age: number;
	dob: Date;
};

export default function YoutubeForm() {
	const form = useForm<FormValues>({
		// default values as an object
		// defaultValues: {
		// 	username: 'Batman',
		// 	email: '',
		// 	channel: '',
		// },
		//
		// default values coming through an API
		defaultValues: async () => {
			const response = await fetch(
				'https://jsonplaceholder.typicode.com/users/1',
			);
			const data = await response.json();
			return {
				username: 'Batman',
				email: data.email,
				channel: '',
				social: {
					twitter: '',
					facebook: '',
				},
				phoneNumbers: ['', ''],
				phNumbers: [{ number: '' }],
				age: 0,
				dob: new Date(),
			};
		},

		// validation modes (default = "onSubmit")
		mode: 'onBlur',
	});
	const {
		register,
		control,
		handleSubmit,
		formState,
		watch,
		getValues,
		setValue,
		reset, // reset form and set to default values
		trigger, // method to (manually) trigger validation
	} = form;
	const {
		errors,
		touchedFields,
		dirtyFields,
		isDirty,
		isValid,
		isSubmitting, // if the form is in the process of being submitted
		isSubmitted, // if the form is submitted
		isSubmitSuccessful, // if the form is successfully submitted without validation errors
		submitCount, // how many times the form is submitted
	} = formState;

	// console.log(touchedFields);
	// console.log(dirtyFields);
	// console.log(isDirty); // for the whole form state and not for individual field

	const { fields, append, remove } = useFieldArray({
		name: 'phNumbers', // field name to use as array field
		control, // control from the form
	});

	const onSubmit = (data: FormValues) => {
		console.log('Form Submitted');
		console.log(data);
	};

	const onError = (errors: FieldErrors<FormValues>) => {
		console.log(errors);
	};

	// const watchUsername = watch('username'); // watch one field
	// const watchUsernameEmail = watch(['username', 'email']); // watch multiple fields
	// const watchAll = watch(); // watch everything
	// console.log(watchAll);

	const handleGetValues = () => {
		// console.log(getValues());
		// console.log(getValues('social'));
		// console.log(getValues('social.twitter'));
		// console.log(getValues(['username', 'channel']));
	};

	const handleSetValue = () => {
		setValue('username', '', {
			shouldDirty: true,
			shouldTouch: true,
			shouldValidate: true,
		});
	};

	return (
		<div>
			<form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
				<div className='form-control'>
					<label htmlFor='username'>Username</label>
					<input
						type='text'
						id='username'
						{...register('username', {
							required: {
								value: true,
								message: 'Username is required!',
							},
						})}
					/>
					<p className='error'>{errors.username?.message}</p>
				</div>

				<div className='form-control'>
					<label htmlFor='email'>Email</label>
					<input
						type='email'
						id='email'
						{...register('email', {
							required: 'Email is required!',
							pattern: {
								value: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
								message: 'Invalid email format!',
							},
							validate: {
								notAdmin: (fieldValue) => {
									return (
										fieldValue !== 'admin@example.com' ||
										'Enter a different email address!'
									);
								},
								notBlackListed: (fieldValue) => {
									return (
										!fieldValue.endsWith('baddomain.com') ||
										'This domain is not supported!'
									);
								},
								emailAvailable: async (fieldValue) => {
									const response = await fetch(
										`https://jsonplaceholder.typicode.com/users?email=${fieldValue}`,
									);

									const data = await response.json();

									return (
										data.length === 0 ||
										'Email already exists!'
									);
								},
							},
						})}
					/>
					<p className='error'>{errors.email?.message}</p>
				</div>

				<div className='form-control'>
					<label htmlFor='channel'>Channel</label>
					<input
						type='text'
						id='channel'
						{...register('channel', {
							required: {
								value: true,
								message: 'Channel is required!',
							},
						})}
					/>
					<p className='error'>{errors.channel?.message}</p>
				</div>

				<div className='form-control'>
					<label htmlFor='twitter'>Twitter</label>
					<input
						type='text'
						id='twitter'
						{...register('social.twitter', {
							required: {
								value: true,
								message: 'Twitter is required!',
							},
							// disabled: true, // disables the validation and sets the value to undefined
							disabled: watch('channel') === '', // disabled when channel field is empty
						})}
					/>
					<p className='error'>{errors.social?.twitter?.message}</p>
				</div>

				<div className='form-control'>
					<label htmlFor='facebook'>Facebook</label>
					<input
						type='text'
						id='facebook'
						{...register('social.facebook', {
							required: {
								value: true,
								message: 'Facebook is required!',
							},
						})}
					/>
					<p className='error'>{errors.social?.facebook?.message}</p>
				</div>

				<div className='form-control'>
					<label htmlFor='primary-phone'>Primary Phone</label>
					<input
						type='text'
						id='primary-phone'
						{...register('phoneNumbers.0', {
							required: {
								value: true,
								message: 'Primary phone number is required!',
							},
						})}
					/>
					<p className='error'>{errors.phoneNumbers?.[0]?.message}</p>
				</div>

				<div className='form-control'>
					<label htmlFor='secondary-phone'>Secondary Phone</label>
					<input
						type='text'
						id='secondary-phone'
						{...register('phoneNumbers.1', {
							required: {
								value: true,
								message: 'Secondary phone number is required!',
							},
						})}
					/>
					<p className='error'>{errors.phoneNumbers?.[1]?.message}</p>
				</div>

				<div>
					<label>List of phone numbers:</label>
					<div>
						{fields.map((field, index) => {
							return (
								<div className='form-control' key={field.id}>
									<input
										type='text'
										{...register(
											`phNumbers.${index}.number`,
										)}
									/>
									{index > 0 && (
										<button
											type='button'
											onClick={() => remove(index)}>
											Remove
										</button>
									)}
								</div>
							);
						})}

						<button
							type='button'
							onClick={() => append({ number: '' })}>
							Add phone number
						</button>
					</div>
				</div>

				<div className='form-control'>
					<label htmlFor='age'>Age</label>
					<input
						type='number'
						id='age'
						{...register('age', {
							required: {
								value: true,
								message: 'Age is required!',
							},
							valueAsNumber: true,
						})}
					/>
					<p className='error'>{errors.age?.message}</p>
				</div>

				<div className='form-control'>
					<label htmlFor='dob'>Date of birth</label>
					<input
						type='date'
						id='dob'
						{...register('dob', {
							required: {
								value: true,
								message: 'Date of birth is required!',
							},
							valueAsDate: true,
						})}
					/>
					<p className='error'>{errors.dob?.message}</p>
				</div>

				<button disabled={!isDirty}>Submit</button>
				<button
					onClick={() => {
						reset();
					}}>
					Reset
				</button>
				<button onClick={handleGetValues}>Get Values</button>
				<button type='button' onClick={handleSetValue}>
					Set Value
				</button>
				<button
					type='button'
					onClick={() => {
						trigger(); // validate all fields
						trigger('channel'); // validate only channel field
					}}>
					Validate
				</button>
			</form>

			<DevTool control={control} />
		</div>
	);
}
