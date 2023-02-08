const seleccionarSkill = (seleccionadas=[], opciones) =>{
  

    console.log('entra helper')

    const skills = ['HTML5', 'CSS3', 'CSSGrid', 'Flexbox', 'JavaScript', 'jQuery', 'Node', 'Angular', 'VueJS', 'ReactJS', 'React Hooks', 'Redux', 'Apollo', 'GraphQL', 'TypeScript', 'PHP', 'Laravel', 'Symfony', 'Python', 'Django', 'ORM', 'Sequelize', 'Mongoose', 'SQL', 'MVC', 'SASS', 'WordPress'];

    let html = '';

    skills.forEach( skill => {
         html += `
             <li>${skill}</li>
         `;
    });

    //return opciones.fn().html = html;
    return skills;

}


export { seleccionarSkill } 
export default seleccionarSkill