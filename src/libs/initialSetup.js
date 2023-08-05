import Role from '../models/Role';

export const createRoles = async() => {
    try {

        const count = await Role.estimatedDocumentCount();
        
        if(count) return

        await Promise.all([
            new Role({ name: 'Usuario' }).save(),
            new Role({ name: 'Moderador' }).save(),
            new Role({ name: 'Administrador' }).save(),
        ]);
    }catch(error) {
        console.error(error);
    }
}