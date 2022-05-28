/**
 * @jest-environment jsdom
 */

import { screen, fireEvent } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import { localStorageMock } from "../__mocks__/localStorage.js"
import mockStore from "../__mocks__/store"
import { ROUTES, ROUTES_PATH} from "../constants/routes.js";
import userEvent from "@testing-library/user-event";

jest.mock("../app/store", () => mockStore)

beforeEach(()=> {
  //simule la connection sur la page Employee en parametrant le localStorage
  Object.defineProperty(window, 'localStorage', { value: localStorageMock })
  window.localStorage.setItem('user', JSON.stringify({
    type: 'Employee'
  }))
  //affiche la page nouvelle note de frais
  document.body.innerHTML = NewBillUI()
})

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    //envoyer un formulaire plein NewBill.handleSubmit
    //justificatif doit etre conforme à l'extension jpg jepg png
    //justificatif ne doit pas être un pdf
    describe("When I try to load file", ()=> {
      test("Then file should be an image", ()=> {        
        //recupération input file
        const newFile = screen.getByTestId('file')
        //recupération instance de class NewBill
        const onNavigate = (pathname) => document.body.innerHTML = ROUTES({ pathname })
        const newBillEmulation = new NewBill({document, onNavigate, store:mockStore, localStorage: window.localStorage})
        const handleChangeFile = jest.fn((e)=> newBillEmulation.handleChangeFile(e))
        //eventListener handleChangeFile
        newFile.addEventListener("change", handleChangeFile)
        userEvent.click(newFile)
        //
        //verifie si le fichier est bien un image
        fireEvent.change(newFile, {
          target: {
            files: [new File(['(⌐□_□)'], 'chucknorris.png', {type: 'image/png'})],
          },
        })
        expect(newFile.files[0].type).toMatch(/(image\/jpg)|(image\/jpeg)|(image\/png)/gm)
      })

      test("Then file should not be an image", ()=> {        
        //recupération input file
        const newFile = screen.getByTestId('file')
        //recupération instance de class NewBill
        const onNavigate = (pathname) => document.body.innerHTML = ROUTES({ pathname })
        const newBillEmulation = new NewBill({document, onNavigate, store:mockStore, localStorage: window.localStorage})
        const handleChangeFile = jest.fn((e)=> newBillEmulation.handleChangeFile(e))
        //eventListener handleChangeFile
        newFile.addEventListener("change", handleChangeFile)
        userEvent.click(newFile)
        //
        //verifie si le fichier est bien un image
        fireEvent.change(newFile, {
          target: {
            files: [new File(['(⌐□_□)'], 'chucknorris.txt', {type: 'text/plain'})],
          },
        })
        expect(newFile.files[0].type).not.toMatch(/(image\/jpg)|(image\/jpeg)|(image\/png)/gm)
      })

      test("Then ...", () => {
        const html = NewBillUI()
        document.body.innerHTML = html
        //to-do write assertion
      })
    })
   
  })
})
