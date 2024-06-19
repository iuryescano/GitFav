import { GithubUser } from "./GithubUser.js"

export class Favorites {
    constructor(root) { //root e o app... tudo que esta em APP
        this.root = document.querySelector(root)
        this.load()
    }

    load() {
        this.entries  = JSON.parse(localStorage.getItem('@github-favorites:')) || []
        
    }

    save() {
        localStorage.setItem('@github-favorites:', JSON.stringify(this.entries)) //ele transforma em um objeto que esta em javascript para um objeto do tipo JSON em string
        
    }

    async add(username) {
        try {

            const userExists = this.entries.find(entry => entry.login === username)
            if(userExists) {
                throw new Error('Usuario ja cadastrado!') //verifica se ja foi cadastrado
            }

            const user = await GithubUser.search(username) 

            if(user.login === undefined) {
                throw new Error ('Usuario nao encontrado!')
            }

            this.entries = [user, ...this.entries] //nessa parte e onde conseguimos inserir varios elementos na na lista ou seja ir adicionando usuarios na minha lista de favoritos
            this.update()
            this.save()

        } catch(error) {
            alert(error.message)
        }
    }

    delete(user) {
        const filteredEntries = this.entries
        .filter(entry =>  //Estou recriando um array se for true ele coloca no array, se for false ele elimina do array
            entry.login !== user.login //se nao e diferente ele elimina do meu array
        )

        this.entries = filteredEntries
        this.update()
        this.save()
    }


}

//classe que vai criar a visualizacao e eventos do HTML
export class FavoritesView extends Favorites {
    constructor(root) {
        super(root) //essa linha e a que chama o construtor de cima

        this.noDataRow = this.root.querySelector('table tfoot .no-data')
        this.tbody = this.root.querySelector('table tbody')
        this.update()
        this.onadd()
    }

    onadd() {
        const addButton =  this.root.querySelector('.search button')
        addButton.onclick = () => {
            const { value } = this.root.querySelector('.search input') //desestruturando e pegando so o value

            this.add(value)
        }
    }

    update() {

        
        
        this.removeAllTr()

        this.entries.forEach( user => {
        //console.log(user) //desse jeito podemos ver o retorno do nosso array com os dados de entrada
            const row = this.createRoW()

            row.querySelector('.user img').src =`https://github.com/${user.login}.png`
            row.querySelector('.user img').alt = `Imagem de ${user.name}`
            row.querySelector('.user a').href =  `https://github.com/${user.login}`
            row.querySelector('.user p').textContent =  user.name
            row.querySelector('.user span').textContent =  user.login
            row.querySelector('.repositories ').textContent =  user.public_repos
            row.querySelector('.followers ').textContent =  user.followers

            row.querySelector('.remove').onclick = () => {
                const isOk = confirm('Tem certeza que deseja deletar essa linha ?')
                if(isOk) {
                    this.delete(user)
                }
            }

            this.tbody.append(row)
        })
        this.toggleNoDataRow()
    }

    createRoW(){
        const tr = document.createElement('tr') //esta sendo criado o tr pelo js

        tr.innerHTML = `
            <td class="user">
                <img src="https://github.com/iuryescano.png" alt="Imagem minha">
                <a href="https://github.com/iuryescano" target="_blank">
                    <p>Iury Escano</p>
                    <span>iuryescano</span>
                </a>
            </td>
            <td class="repositories">
                77
            </td>
            <td class="followers">
                9589
            </td>
            <td>
                <button class="remove">Remover</button>
            </td>
        `

        return tr
    }

    removeAllTr(){
        this.tbody.querySelectorAll('tr').forEach((tr) => {
            tr.remove()
        })
    }

    toggleNoDataRow(){
        if (this.entries.length === 0) {
            this.noDataRow.classList.remove('hidden')
        } else {
            this.noDataRow.classList.add('hidden')
        }
    }
}
