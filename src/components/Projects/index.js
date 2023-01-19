import './index.css'

const Projects = props => {
  const {projectLists} = props
  const {name, imageUrl} = projectLists
  return (
    <li className="project-item">
      <img src={imageUrl} alt={name} className="project-img" />
      <p className="project-name">{name}</p>
    </li>
  )
}

export default Projects
