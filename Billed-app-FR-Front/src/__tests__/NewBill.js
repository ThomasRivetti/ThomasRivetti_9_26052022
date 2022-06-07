/**
 * @jest-environment jsdom
 */

import { screen, fireEvent, waitFor } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import { localStorageMock } from "../__mocks__/localStorage.js"
import mockStore from "../__mocks__/store"
import { ROUTES, ROUTES_PATH } from "../constants/routes.js";
import userEvent from "@testing-library/user-event";
import router from "../app/Router"

jest.mock("../app/store", () => mockStore)

beforeEach(() => {
  //simule la connection sur la page Employee en parametrant le localStorage
  Object.defineProperty(window, 'localStorage', { value: localStorageMock })
  window.localStorage.setItem('user', JSON.stringify({
    type: 'Employee',
    email: 'employee@test.tld'
  }))
  //affiche la page nouvelle note de frais
  document.body.innerHTML = NewBillUI()
})

describe('NewBill Unit Test Suites', () => {
  describe("Given I am connected as an employee", () => {
    describe("When I am on NewBill Page", () => {
      describe("When I try to load file", () => {
        test("Then file should be an image", () => {
          //recupération input file
          const newFile = screen.getByTestId('file')
          //recupération instance de class NewBill
          const onNavigate = (pathname) => document.body.innerHTML = ROUTES({ pathname })
          const newBillEmulation = new NewBill({ document, onNavigate, store: mockStore, localStorage: window.localStorage })
          const handleChangeFile = jest.fn((e) => newBillEmulation.handleChangeFile(e))
          //eventListener handleChangeFile
          newFile.addEventListener("change", handleChangeFile)
          userEvent.click(newFile)
          //verifie si le fichier est bien un image
          fireEvent.change(newFile, {
            target: {
              files: [new File(['(⌐□_□)'], 'chucknorris.png', { type: 'image/png' })],
            },
          })
          expect(newFile.files[0].type).toMatch(/(image\/jpg)|(image\/jpeg)|(image\/png)/gm)
        })

        test("Then file should not be an image", () => {
          const jsdomAlert = window.alert;  // remember the jsdom alert
          window.alert = () => { };  // provide an empty implementation for window.alert        

          //recupération input file
          const newFile = screen.getByTestId('file')
          //recupération instance de class NewBill
          const onNavigate = (pathname) => document.body.innerHTML = ROUTES({ pathname })
          const newBillEmulation = new NewBill({ document, onNavigate, store: mockStore, localStorage: window.localStorage })
          const handleChangeFile = jest.fn((e) => newBillEmulation.handleChangeFile(e))
          //eventListener handleChangeFile
          newFile.addEventListener("change", handleChangeFile)
          userEvent.click(newFile)
          //verifie si le fichier est bien un image
          fireEvent.change(newFile, {
            target: {
              files: [new File(['(⌐□_□)'], 'chucknorris.txt', { type: 'text/plain' })],
            },
          })
          expect(newFile.files[0].type).not.toMatch(/(image\/jpg)|(image\/jpeg)|(image\/png)/gm)
          window.alert = jsdomAlert;  // restore the jsdom alert
        })
      })
    })
  })
})

describe('NewBill Integration Test Suites', () => {
  describe("Given I am a user connected as Employee", () => {
    describe("When I on NewBill", () => {
      test('Then I submit completed NewBill form and I am redirected on Bills, method Post', async () => {
        //creation d'une DIV dans le DOM
        document.body.innerHTML = `<div id="root"></div>`;
        //creation contenu de la page en fonction du PATHNAME
        router()
        window.onNavigate(ROUTES_PATH.NewBill)
        //remplissage du formulaire
        const expenseName = screen.getByTestId("expense-name")
        expenseName.value = 'Vol'
        const datePicker = screen.getByTestId("datepicker")
        datePicker.value = '2020-01-01'
        const amount = screen.getByTestId("amount")
        amount.value = '100'
        const vat = screen.getByTestId("vat")
        vat.value = '20'
        const vatPct = screen.getByTestId("pct")
        vatPct.value = '20'
        const file = screen.getByTestId("file")
        //ajout d'une image en justificatif
        fireEvent.change(file, {
          target: {
            files: [new File(['(⌐□_□)'], 'chucknorris.png', { type: 'image/png' })],
          },
        })
        //selection du formulaire
        const formSubmission = screen.getByTestId("form-new-bill")
        //nouvelle instance de NewBill
        const newBillEmulation = new NewBill({ document, onNavigate, store: mockStore, localStorage: window.localStorage })
        //simulation de la fonction de soumission du formulaire
        const handleSubmit = jest.fn((e) => newBillEmulation.handleSubmit(e))
        formSubmission.addEventListener('submit', handleSubmit)
        fireEvent.submit(formSubmission)
        //attendu: le formulaire est soumis par le clic sur le bouton "ENVOYER"
        expect(handleSubmit).toHaveBeenCalled()
        //attendu: retourne sur la page BILLS
        await waitFor(() => screen.getByText("Mes notes de frais"))
        expect(screen.getByTestId('btn-new-bill')).toBeTruthy()
      })
    })

    describe("When an error occurs on API", () => {
      beforeEach(() => {
        //espionne la methode bills dans l'objet mockstore
        jest.spyOn(mockStore, "bills")
        //défini la propriété de localStorage de l'objet window
        Object.defineProperty(
          window,
          'localStorage',
          { value: localStorageMock }
        )
        //simule la connection en tant qu'employé
        window.localStorage.setItem('user', JSON.stringify({
          type: 'Employee',
          email: "a@a"
        }))
        document.body.innerHTML = `<div id="root"></div>`;
        router()
      })

      test('Then add newBill with API and fails with 500 message error', async () => {
        //défini l'erreur 500
        mockStore.bills.mockImplementationOnce(() => {
          return {
            create: () => {
              return Promise.reject(new Error("Erreur 500"))
            }
          }
        })
        //on est sur la page Newbill
        window.onNavigate(ROUTES_PATH.NewBill)
        //recupération input file
        const newFile = screen.getByTestId('file')
        //recupération instance de class NewBill
        const onNavigate = (pathname) => document.body.innerHTML = ROUTES({ pathname })
        const newBillEmulation = new NewBill({ document, onNavigate, store: mockStore, localStorage: window.localStorage })
        const handleChangeFile = jest.fn((e) => newBillEmulation.handleChangeFile(e))
        //eventListener handleChangeFile
        newFile.addEventListener("change", handleChangeFile)
        fireEvent.change(newFile, {
          target: {
            files: [new File(['(⌐□_□)'], 'chucknorris.png', { type: 'image/png' })],
          },
        })
        //attend la fin des taches pour afficher le resultat (promesse)
        await new Promise(process.nextTick);
        //affiche le message d'erreur 500
        const message = await screen.getByText(/Erreur 500/)
        expect(message).toBeTruthy()
      })

      test('Then add newbill with API and fails with 404 message error', async () => {
        //défini l'erreur 404
        mockStore.bills.mockImplementation(() => {
          return {
            create: () => {
              return Promise.resolve({ fileUrl: 'https://localhost:3456/images/test.jpg', key: '1234' })
            },
            update: () => {
              return Promise.reject(new Error("Erreur 404"))
            }
          }
        })
        //creation d'une DIV dans le DOM
        document.body.innerHTML = `<div id="root"></div>`;
        //creation contenu de la page en fonction du PATHNAME
        router()
        window.onNavigate(ROUTES_PATH.NewBill)
        //remplissage du formulaire
        const expenseName = screen.getByTestId("expense-name")
        expenseName.value = 'Vol'
        const datePicker = screen.getByTestId("datepicker")
        datePicker.value = '2020-01-01'
        const amount = screen.getByTestId("amount")
        amount.value = '100'
        const vat = screen.getByTestId("vat")
        vat.value = '20'
        const vatPct = screen.getByTestId("pct")
        vatPct.value = '20'
        const file = screen.getByTestId("file")
        //ajout d'une image en justificatif
        fireEvent.change(file, {
          target: {
            files: [new File(['(⌐□_□)'], 'chucknorris.png', { type: 'image/png' })],
          },
        })
        //selection du formulaire
        const formSubmission = screen.getByTestId("form-new-bill")
        //nouvelle instance de NewBill
        const newBillEmulation = new NewBill({ document, onNavigate, store: mockStore, localStorage: window.localStorage })
        //simulation de la fonction de soumission du formulaire
        const handleSubmit = jest.fn((e) => newBillEmulation.handleSubmit(e))
        formSubmission.addEventListener('submit', handleSubmit)
        fireEvent.submit(formSubmission)
        //attend la fin des taches pour afficher le resultat (promesse)
        await new Promise(process.nextTick)
        //affiche le texte de l'erreur 404
        const message = await screen.getByText(/Erreur 404/)
        expect(message).toBeTruthy()
      })
    })
  })
})

//404
