import {Component} from 'react'
import Loader from 'react-loader-spinner'

import Projects from '../Projects'

import './index.css'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const apiStateConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'Failure',
  inProgress: 'IN_PROGRESS',
}

export default class ProjectShowcase extends Component {
  state = {
    activeOptionId: categoriesList[0].id,
    projectLists: [],
    apiStatus: apiStateConstants.initial,
  }

  componentDidMount() {
    this.getProjectLists()
  }

  getProjectLists = async () => {
    this.setState({apiStatus: apiStateConstants.inProgress})
    const {activeOptionId} = this.state
    const url = `https://apis.ccbp.in/ps/projects?category=${activeOptionId}`
    const options = {
      method: 'GET',
    }
    const response = await fetch(url, options)
    if (response.ok) {
      const data = await response.json()
      const projectLists = data.projects.map(each => ({
        id: each.id,
        imageUrl: each.image_url,
        name: each.name,
      }))
      this.setState({projectLists, apiStatus: apiStateConstants.success})
    } else {
      this.setState({apiStatus: apiStateConstants.failure})
    }
  }

  onClickRetry = () => {
    this.getProjectLists()
  }

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#4656a1" height="50" width="50" />
    </div>
  )

  renderFailureView = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
        className="failure-image"
      />
      <h1 className="failure-head">Oops! Something Went Wrong</h1>
      <p className="desc">
        We cannot seem to find the page you are looking for.
      </p>
      <button className="fail-btn" type="button" onClick={this.onClickRetry}>
        Retry
      </button>
    </div>
  )

  changeOptions = event => {
    this.setState({activeOptionId: event.target.value}, this.getProjectLists)
  }

  renderProjectLists = () => {
    const {projectLists} = this.state
    return (
      <ul className="project-list">
        {projectLists.map(each => (
          <Projects key={each.id} projectLists={each} />
        ))}
      </ul>
    )
  }

  renderProjectStatus = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStateConstants.success:
        return this.renderProjectLists()
      case apiStateConstants.inProgress:
        return this.renderLoadingView()
      case apiStateConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    const {activeOptionId} = this.state
    return (
      <div className="app-container">
        <nav className="nav-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
            alt="website logo"
            className="web-logo"
          />
        </nav>
        <select
          value={activeOptionId}
          onChange={this.changeOptions}
          className="select"
        >
          {categoriesList.map(eachOption => (
            <option
              key={eachOption.id}
              value={eachOption.id}
              className="option"
            >
              {eachOption.displayText}
            </option>
          ))}
        </select>
        {this.renderProjectStatus()}
      </div>
    )
  }
}
