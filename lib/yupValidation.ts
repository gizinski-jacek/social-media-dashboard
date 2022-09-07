import * as Yup from 'yup';

export default async function yupValidation<T = Record<string, any>>(
	scheme: Yup.SchemaOf<T>,
	data: Record<string, any> | null
) {
	try {
		await scheme.validate(data, { abortEarly: false });
		return { isValid: true, errors: null };
	} catch (error: any) {
		const { errors } = error;
		return { isValid: false, errors };
	}
}
