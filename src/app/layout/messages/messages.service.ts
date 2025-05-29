import {Injectable} from '@angular/core'
import {HttpClient} from '@angular/common/http';
import {GenericDatasource} from '@sycadApp/models/generic-datasource';
import {Notification} from '@sycadApp/models/data-references/system/model';
import {environment} from '../../../environments/environment';

@Injectable()
export class MessagesService extends GenericDatasource <Notification, Notification, Notification> {

  constructor(public http: HttpClient) {
    super(http);
  }

    private messages = [
        {
            name: 'Jean jack',
            image: '1',
            text: 'After you get up and running, you can place Font Awesome icons just about...',
            time: '1 min ago'
        },
        {
            name: 'Ibrahima',
            image: '2',
            text: 'You asked, Font Awesome delivers with 40 shiny new icons in version 4.2.',
            time: '2 hrs ago'
        },
        {
            name: 'Therry',
            image: '3',
            text: 'Want to request new icons? Here\'s how. Need vectors or want to use on the...',
            time: '10 hrs ago'
        },
        {
            name: 'Tapha',
            image: '4',
            text: 'Explore your passions and discover new ones by getting involved. Stretch your...',
            time: '1 day ago'
        },
        {
            name: 'Abdou',
            image: '5',
            text: 'Get to know who we are - from the inside out. From our history and culture, to the...',
            time: '1 day ago'
        },
        {
            name: 'Sophie',
            image: '6',
            text: 'Need some support to reach your goals? Apply for scholarships across...',
            time: '2 days ago'
        },
        {
            name: 'Michael',
            image: '7',
            text: 'Wrap the dropdown\'s trigger and the dropdown menu within .dropdown, or...',
            time: '1 week ago'
        }
    ];   

    private files = [        
        {
            text:'fichier1.zip',
            size: '~6.2 MB',
            value: '47',
            color: 'primary'
        },
        {
            text: 'fichier2.pdf',
            size: '~14.6 MB',
            value: '33',
            color: 'accent'
        },
        {
            text: 'fichier3.jpg',
            size: '~558 KB',
            value: '60',
            color: 'warn'
        },
        {
            text: 'fichier4.doc',
            size: '~57 KB',
            value: '80',
            color: 'primary'
        },
        {
            text: 'fichier5.zip',
            size: '~10.2 MB',
            value: '55',
            color: 'warn'
        },
        {
            text: 'fichier6.xlsx',
            size: '~96 KB',
            value: '75',
            color: 'accent'
        }
    ];

    private meetings = [
        {
            day: '09',
            month: 'May',
            title: 'Réunion avec Bruno',
            text: 'Fusce ut condimentum velit, quis egestas eros. Quisque sed condimentum neque.',
            color: 'danger'
        },       
        {
            day: '15',
            month: 'May',
            title: 'Séminaire pédagogique ',
            text: 'Fusce arcu tortor, tempor aliquam augue vel, consectetur vehicula lectus.',
            color: 'primary'
        },
        {
            day: '12',
            month: 'June',
            title: 'Diner de galla',
            text: 'Curabitur rhoncus facilisis augue sed fringilla.',
            color: 'info'
        },
        {
            day: '14',
            month: 'June',
            title: 'Fête nationale',
            text: 'Vivamus tristique enim eros, ac ultricies sem ultrices vitae.',
            color: 'warning'
        },
        {
            day: '29',
            month: 'July',
            title: 'Breffing équipe',
            text: 'Nam porttitor justo nec elit efficitur vestibulum.',
            color:'success'
        }
    ];

    public getMessages():Array<Object> {
        return this.messages;
    }

    public getFiles():Array<Object> {
        return this.files;
    }

    public getMeetings():Array<Object> {
        return this.meetings;
    }

  getUrl(): string {
    return environment.APPLICATION.NOTIFICATION_API + "/by-agent";
  }


  getNotifications() {
    return this.http.get<Notification[]>(this.getUrl(), { observe: 'response' });
  }

  public  getDateFields(): string[] {
    return ['date', 'dateCreationDossier', 'dateNaissance', 'dateDoc', 'dateRealisation', 'dateExterne', 'dateMajPlan', 'debut', 'fin', 'dateExpiration', 'dateDeCreation', 'createdAt', 'dateObtention', 'dateDelivrance', 'dateDoc', 'dateValidite', 'dateRetrait'];
  }

}
