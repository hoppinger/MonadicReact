import * as React from "react"
import * as ReactDOM from "react-dom"
import * as Immutable from "immutable"
import * as i18next from 'i18next'

export type LazyImageProps = { 
  download:()=>Promise<string>, 
  upload:(src:string)=>Promise<void>, 
  can_edit:boolean,
  entity_id:number, entity_name:string, image_name:string }
export type LazyImageState = { image:"uploading"|"loading"|{src:string} }
export class LazyImage extends React.Component<LazyImageProps, LazyImageState> {
  constructor(props:LazyImageProps, context:any) { 
    super(props, context) 
    this.state = { image:"loading" }
  }

  componentWillMount() {
    this.props.download().then(src => this.setState({...this.state, image: {src: src}}))
  }

  render() {
    if (this.state.image == "loading")
      return <div className="loading">Loading...</div>
    if (this.state.image == "uploading")
      return <div className="uploading">Uploading...</div>

    return <div className="lazy-image">
      <img id={`${this.props.entity_name}_${this.props.entity_id}_${this.props.image_name}`} src={this.state.image.src}/>
      {
        this.props.can_edit ?
          <div className="image-controls">
            <a className="user button button--delete"
              style={!this.props.can_edit ? {pointerEvents:"none"} : {}}
                onClick={() => {
                    if(confirm(i18next.t('Are you sure?'))) {
                      let new_value = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAMSURBVBhXY/j//z8ABf4C/qc1gYQAAAAASUVORK5CYII="
                      this.setState({...this.state, image: "uploading"}, () =>
                        this.props.upload(new_value).then(() =>
                          this.setState({...this.state, image: {src: new_value}}))
                      )
                        {/*() => document.getElementById(`User_${this.props.entity.Id}_ProfilePic`).setAttribute('src', new_value),
                        true)*/}
                    }
                  }
                }>
            </a>
            <input disabled={!this.props.can_edit} type="file" accept="image/*" onChange={(e:any) => {
                let files:FileList = (e.target as any).files;
                let file_reader = new FileReader()

                file_reader.onload = ((e) => {
                  let new_value = file_reader.result
                  this.setState({...this.state, image: "uploading"}, () =>
                    this.props.upload(new_value).then(() =>
                      this.setState({...this.state, image: {src: new_value}}))
                  )
                    {/*() => document.getElementById(`User_${this.props.entity.Id}_ProfilePic`).setAttribute('src', new_value),
                    true)*/}
                });

                file_reader.readAsDataURL(files[0]);
              }
              } />

          </div>
        :
        null
      }
    </div>
  }
}
